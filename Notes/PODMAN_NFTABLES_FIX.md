# Podman nftables Error — Root Cause & Fix

## Error Message

```
Error: unable to start container "...": netavark (exit code 1): nftables error: "nft" did not return successfully while applying ruleset
```

---

## Root Cause

The Microsoft custom WSL2 kernel (`6.6.87.2-microsoft-standard-WSL2`) is missing several nftables kernel modules (e.g. `nft_fib_inet`, `nft_fib_ipv6`), causing netavark to fail when applying the nftables ruleset during container network setup.

Podman uses **netavark** as the default network backend, and netavark uses **nftables** as the default firewall driver — which is incompatible with the WSL2 kernel.

---

## Final Solution

Switch the firewall driver to `iptables` inside the Podman Machine (WSL2 VM):

```bash
# Enter the Podman VM
podman machine ssh BTIRD_PM

# Write the config
sudo mkdir -p /etc/containers
printf '[network]\nfirewall_driver = "iptables"\n' | sudo tee /etc/containers/containers.conf

# Restart podman socket
sudo systemctl restart podman.socket

# Verify it works (should output "OK")
curl --unix-socket /run/podman/podman.sock http://localhost/_ping

exit
```

After applying the fix, the following command should work normally:

```powershell
podman-compose -p bluevision_prod -f .\podman-compose.prod.yml up -d
```

---

## Notes

- This config is stored at `/etc/containers/containers.conf` inside the VM. **It must be reconfigured if the Podman Machine is recreated.**
- Do NOT set `network_backend = "cni"` in this file. This version of Podman does not support CNI and will cause the podman service to fail to start (exit code 125).
- The `nft list ruleset` command itself runs successfully, but specific nftables rule modules are missing — use iptables as a workaround.

---

## Troubleshooting Summary

| Step | Result |
|------|--------|
| `nft list ruleset` | OK — basic kernel modules present |
| `modprobe nft_fib_inet` | FATAL: module not found |
| `podman run --network bridge alpine echo test` | nftables error confirmed |
| Set `firewall_driver = "iptables"` | Success — `echo test` output correctly |
