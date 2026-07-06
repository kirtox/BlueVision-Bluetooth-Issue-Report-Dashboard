# Podman Socket & Cgroup Issue Fix

## Problem Description

The following command failed when trying to start the dev db container:

```powershell
podman-compose -p bluevision_dev -f podman-compose.dev.yml up db -d
```

### Error 1: cgroup error

```
Error: unable to start container "f831c77a...": did not receive systemd slice as cgroup parent
when using systemd to manage cgroups: invalid argument
```

### Error 2: socket connection failed (appeared after fixing cgroup)

```
Error: unable to connect to Podman socket: Get "http://d/v5.7.0/libpod/_ping":
ssh: rejected: connect failed (open failed)
```

---

## Root Cause

### Cause 1: Incorrect Cgroup Manager Setting

- Podman Machine type is **WSL**, which does not have systemd
- Podman defaults to `cgroup_manager = "systemd"`, causing container creation to fail
- `~/.config/containers/containers.conf` did not exist, so no override was in place

### Cause 2: Podman Socket Service Not Listening

- The service process for `/run/podman/podman.sock` had stopped (can happen after Podman Desktop updates or system restarts)
- `podman.socket` systemd unit status was `inactive (dead)`
- The Windows `podman` CLI connects to this socket over SSH — when the socket dies, all podman commands fail

---

## Fix Steps

### Step 1: Fix containers.conf (cgroup manager)

```powershell
podman machine ssh BTIRD_PM "echo '[engine]' > ~/.config/containers/containers.conf; echo 'cgroup_manager = \""cgroupfs\""' >> ~/.config/containers/containers.conf"
```

Verify the content is correct:
```powershell
podman machine ssh BTIRD_PM "cat ~/.config/containers/containers.conf"
# Expected output:
# [engine]
# cgroup_manager = "cgroupfs"
```

### Step 2: Restart the Podman Socket Service

```powershell
podman machine ssh BTIRD_PM "nohup podman system service --time=0 unix:///run/podman/podman.sock > /tmp/podman-service.log 2>&1 &"
```

Verify the connection is restored:
```powershell
podman ps
```

### Step 3: Start the dev db

```powershell
podman-compose -p bluevision_dev -f podman-compose.dev.yml up db -d
```

---

## Notes

- **Running prod containers are not affected** — this change only impacts newly created containers
- **After a reboot or Podman Machine restart**, the socket service may stop again; re-run Step 2
- `cgroupfs` is more stable than `systemd` in WSL environments and is the correct setting here

---

## Diagnostic Commands

```powershell
# Check cgroup version and manager
podman info --format "{{.Host.CgroupsVersion}} {{.Host.CgroupManager}}"

# List Podman Machines
podman machine list

# List Podman connection settings
podman system connection list

# Check socket service status inside WSL
podman machine ssh BTIRD_PM "systemctl --user status podman.socket"

# View socket service log
podman machine ssh BTIRD_PM "cat /tmp/podman-service.log"
```

---

## Environment Info

| Item | Value |
|------|-------|
| Podman Machine Name | BTIRD_PM |
| VM Type | WSL |
| Socket Path (root) | `/run/podman/podman.sock` |
| Cgroup Version | v2 |
| Fixed Cgroup Manager | cgroupfs |
