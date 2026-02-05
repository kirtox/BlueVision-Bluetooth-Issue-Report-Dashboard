# BlueVision
## Bluetooth Issue Report Dashboard

   {\_/}
{\ (OwO)
{ \/>  )>

A dashboard for collecting, visualizing, and reporting Bluetooth issue data.
The project provides both backend and frontend components, supports containerized deployment, and is designed to streamline Bluetooth testing and debugging workflows.

---

## ✨ Key Features

- **Issue Tracking & Logging**Store and organize Bluetooth-related test results and logs.
- **Manage logs**Once the logs are updated to the database, we can manage the log in this dashboard.
- **Data Visualization**Frontend dashboards to plot **Bluetooth Driver Reliability**, **Integration Test**, **Platform Summary**, **WLAN Reliability**, and other metrices.
- **Excel & Report Export**Generate structured reports for further analysis or sharing.
- **Containerized Deployment**
  Podman Compose files are included for running services consistently across environments.

---

## 📂 Project Structure

```
BlueVision-Bluetooth-Issue-Report-Dashboard/
├── backend/                 # Backend services and APIs
├── frontend/                # Frontend dashboard (UI)
├── db_backups/              # Database backup files
├── scripts/                 # Helper scripts (Not yet)
├── .github/workflows/       # CI/CD configurations (Not yet)
├── podman-compose.dev.yml   # Development environment config
├── podman-compose.prod.yml  # Production environment config
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kirtox/BlueVision-Bluetooth-Issue-Report-Dashboard.git
cd BlueVision-Bluetooth-Issue-Report-Dashboard
```

### 2. Podman Compose Commands by PowerShell

For development:

```bash
# Run in PowerShell window
podman-compose -p BlueVision_dev -f podman-compose.dev.yml up --build

# Stop
podman-compose -p BlueVision_dev -f podman-compose.dev.yml down
```

For production:

```bash
# Run in background
podman-compose -p BlueVision_prod -f podman-compose.prod.yml up --build -d

# Stop
podman-compose -p BlueVision_prod -f podman-compose.prod.yml down
```

For checking current status of each podman container:

```podman list
podman ps
```

**Alternative build process:**

```bash
# To stop all services
podman-compose -p BlueVision_prod -f .\podman-compose.prod.yml down

# Build the services that need to be built
podman build -t BlueVision_prod_backend -f backend/Dockerfile.prod backend/
podman build -t BlueVision_prod_frontend -f frontend/Dockerfile.prod frontend/

# Restart all services (included db)
podman-compose -p BlueVision_prod -f .\podman-compose.prod.yml up -d
```

**Migrating Container Data**
```bash
# 1. Check current volumes
podman volume ls

# Create new volume
podman volume create bluevision_prod_pgdata_prod

# Copy data from old volume to new volume
podman run --rm -v oldname_prod_pgdata_prod:/old_data -v bluevision_prod_pgdata_prod:/new_data postgres:15 sh -c "cp -r /old_data/* /new_data/"

# WARNING: Run cleanup after migrating data! Clean up unused containers first
podman container prune

# Clean up unused images
podman image prune

# Clean up unused volumes
podman volume prune

# Clean up unused networks
podman network prune

# Clean up all unused resources (containers, images, networks, volumes)
podman system prune

# Clean up all unused resources, including images not used by any container
podman system prune -a

# Also clean up volumes (WARNING! This will delete data)
podman system prune -a --volumes
```

### 3. Production Environment Setup

In production, make sure to configure firewall rules and port forwarding:

#### 🔥 Firewall Configuration

Allow inbound traffic on ports **8001** and **5174**.

#### 🔀 Port Proxy Configuration (Windows)

Run the following commands in **PowerShell** or **Command Prompt** (Administrator):

```bash
# Add NAT
netsh interface portproxy add v4tov4 listenaddress=192.168.70.122 listenport=5174 connectaddress=127.0.0.1 connectport=5174
netsh interface portproxy add v4tov4 listenaddress=192.168.70.122 listenport=8001 connectaddress=127.0.0.1 connectport=8001

netsh interface portproxy add v4tov4 listenaddress=10.225.74.155 listenport=5174 connectaddress=127.0.0.1 connectport=5174
netsh interface portproxy add v4tov4 listenaddress=10.225.74.155 listenport=8001 connectaddress=127.0.0.1 connectport=8001

# Remove NAT
netsh interface portproxy delete v4tov4 listenaddress=192.168.70.122 listenport=5174
netsh interface portproxy delete v4tov4 listenaddress=192.168.70.122 listenport=8001

netsh interface portproxy delete v4tov4 listenaddress=10.225.74.155 listenport=5174
netsh interface portproxy delete v4tov4 listenaddress=10.225.74.155 listenport=8001

# Check NAT table
netsh interface portproxy show all
```

**For development**
- VScode debugging mode
- Need to setup Dev_db for testing
- Build a container for Dev_db
```bash
podman-compose -p bluevision_dev -f podman-compose.dev.yml up db -d
```
- Load latest db_backups sql file to container
```bash
# Find Dev_db container ID
$DB_CONTAINER = podman ps -q -f name=bluevision_dev_db
# Restore database
Get-Content .\db_backups\manual_backup_20260205_162139.sql | podman exec -i $DB_CONTAINER psql -U admin -d btird
```
- Test finished.
```bash
# Stop container
podman-compose -p bluevision_dev -f podman-compose.dev.yml down
```

This allows external devices on your LAN to access the dashboard services through the host machine.

> If the podman compose did not work successfully, try the steps below.
>
> Note: Sometimes after a PC reboot, services may not start automatically. Remove NAT rules if needed and retry.

```
# Start services in the correct order
podman-compose -p BlueVision_prod -f .\podman-compose.prod.yml up -d db
podman-compose -p BlueVision_prod -f .\podman-compose.prod.yml up -d db-backup
# Wait for the database to become healthy
podman-compose -p BlueVision_prod -f .\podman-compose.prod.yml up -d backend
# Wait for the backend to fully start
podman-compose -p BlueVision_prod -f .\podman-compose.prod.yml up -d frontend
```

---

## 🛠️ Tech Stack

- **Backend**: Python (FastAPI / Flask style services)
- **Frontend**: React + TypeScript + Recharts (for visualizations)
- **Database**: PostgreSQL (with backup support)
- **Deployment**: Podman Compose
- **CI/CD**: GitHub Actions (**Not yet**)

---

## 📊 Example Use Cases

- Collect trace logs and visualize dynamic charts over time.
- Generate **Excel reports** for test results.

---

## 🔐 User Roles & Permissions

The dashboard implements a role-based access control system with three user roles:

> To create the administrator account, enter the backend container:
>
> ```
> podman exec -it <container_name_or_id> bash
> ```
>
> Then run ``python create_admin.py`` to create the first administrator account.

### Administrator

- Full access to all features
- Can create, edit, and delete any report
- Can manage user accounts
- Can view API access logs
- Can manage platform configurations
- Can export reports

### User

- Can view all reports
- Can create new reports (operator name automatically set to username)
- Can edit and delete only their own reports (where `op_name` matches their username)
- Can export reports
- Can edit their own profile

### Guest

- Read-only access
- Can view reports and dashboards
- Cannot create, edit, or delete reports
- Cannot export reports
- Cannot access user management or logs

### 🖼️ User Interface Screenshots

> *The Profile page displays user information.*
>
> *Only users with **admin** role can see **User Management** and **Logs** in the sidebar.*

![Setting_ProfilePage_Admin](./demo/images/Setting_ProfilePage_Admin.png "Setting_ProfilePage_Admin")![Setting_ProfilePage_User](./demo/images/Setting_ProfilePage_User.png "Setting_ProfilePage_User")

> *User Management – Administrators can manage all user accounts and permissions.*

![User_Management](./demo/images/User_Management.png "User_Management")

---

## 🖼️ System Interface Screenshots

> _Homepage – Shows platform summary, platform status, report table, gauge charts, and bar charts._

![HomepageScreenshot Placeholder](./demo/images/Homepage1.png "Homepage")

> *Report table and filters – Display platform summary, platform status, report data, gauge charts, and bar charts.*

![ReportTable_Filters](./demo/images/ReportTable_Filters_Coverd.png "ReportTable_Filters")

> *Table Summary – Aggregates data based on selected conditions and time duration. (Respects active filter conditions)*

![Charts_Table_Summary_wo_Filters_1](./demo/images/Charts_Table_Summary_wo_Filters_1.png "Charts_Table_Summary_wo_Filters_1")![Charts_Table_Summary_wo_Filters_2](./demo/images/Charts_Table_Summary_wo_Filters_2.png "Charts_Table_Summary_wo_Filters_2")

![Charts_Table_Summary_wo_Filters_3](./demo/images/Charts_Table_Summary_wo_Filters_3.png "Charts_Table_Summary_wo_Filters_3")

> *Reliability Summary – Aggregates reliability metrics across different conditions based on data count. (Respects active filter conditions)*

![Charts_Table_Reliability_Summary_wo_Filters](./demo/images/Charts_Table_Reliability_Summary_wo_Filters.png "Charts_Table_Reliability_Summary_wo_Filters")

> *Durability Summary – Aggregates durability metrics across different conditions based on time duration. (Respects active filter conditions)*

![Charts_Table_Durability_Summary_wo_Filters](./demo/images/Charts_Table_Durability_Summary_wo_Filters.png "Charts_Table_Durability_Summary_wo_Filters")

> *Create Report – Manual report creation interface for ad-hoc report generation.*

![CreateReport_Manually](./demo/images/CreateReport_Manually.png "CreateReport_Manually")
