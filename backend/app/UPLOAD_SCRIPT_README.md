# Report Upload Script Usage Guide

This script allows you to upload reports to the system via Python command line. Report data is defined directly in the script, no external JSON files required.

## Environment Setup

### 1. Install Dependencies
```bash
pip install requests python-dotenv
```

### 2. Environment Variable Configuration
Set in `frontend/.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
API_USERNAME=your_username
API_PASSWORD=your_password
```

## Usage

### 1. Display Current Report Data
```bash
python upload_report.py --show
```

### 2. Upload Using Script API (Recommended, No Login Required)
```bash
python upload_report.py --upload --script-api
```

### 3. Specify Different op_name
```bash
python upload_report.py --upload --script-api --op-name john_doe
```

### 4. Upload Using Authenticated API
```bash
python upload_report.py --upload --username admin --password admin123
```

### 5. Specify Different API URL
```bash
python upload_report.py --upload --script-api --url http://your-server:8001
```

## Modifying Report Data

To modify report data, directly edit the `REPORT_DATA` constant in the `upload_report.py` file:

```python
REPORT_DATA = {
    "op_name": "your_username",  # Modify operator name
    "serial_num": "SN_YOUR_001", # Modify serial number
    "platform": "YourPlatform",  # Modify platform
    "scenario": "Your Test Scenario", # Modify test scenario
    "result": "PASS",            # Modify test result
    # ... other fields
}
```

### Common Modification Items:
- `op_name`: Operator name (must exist in user table)
- `serial_num`: Device serial number
- `platform`: Platform name
- `scenario`: Test scenario description
- `result`: Test result (PASS/FAIL)
- `cycles`: Test cycle count
- `duration`: Test duration

## Data Field Format

Refer to the `REPORT_DATA` constant in the script, which contains all available fields. Main field descriptions:

### Required Fields
- `serial_num`: Serial number
- `os_version`: Operating system version
- `platform_brand`: Platform brand
- `platform`: Platform name
- `platform_phase`: Platform phase
- `platform_bios`: BIOS version
- `cpu`: CPU model
- `wlan`: WLAN model
- `wlan_phase`: WLAN phase
- `bt_driver`: Bluetooth driver version
- `bt_interface`: Bluetooth interface
- `wifi_driver`: WiFi driver version
- `audio_driver`: Audio driver version
- `wrt_version`: WRT version
- `wrt_preset`: WRT preset
- `scenario`: Test scenario
- `modern_standby`: Modern standby (Y/N)
- `s4`: S4 sleep (Y/N)
- `warm_boot`: Warm boot (Y/N)
- `cold_boot`: Cold boot (Y/N)
- `microsoft_teams`: Microsoft Teams (Y/N)
- `apm`: APM (Y/N)
- `opp`: OPP (Y/N)
- `swift_pair`: Swift Pair (Y/N)
- `power_type`: Power type
- `result`: Test result (PASS/FAIL)

### Optional Fields
- `op_name`: Operator name (User role will auto-set to login username)
- `date`: Date time (defaults to current time)
- Various device information (mouse, keyboard, headset, etc.)
- Test parameters (cycles, waiting time, etc.)
- Issue tracking (JIRA ID, IPS ID, etc.)

## API Mode Description

### Script API Mode (`--script-api`)
- **No login authentication required**, simplifies script usage
- Only validates if `op_name` exists in user table
- Checks if user is active (`is_active = 'Y'`)
- Suitable for automated scripts and batch uploads

### Authenticated API Mode (Default)
- Requires full login authentication
- **User role**: `op_name` will be auto-set to login username
- **Administrator role**: Can specify any `op_name`
- Suitable for manual operations and scenarios requiring strict permission control

## Error Handling

The script will display detailed error messages:
- `[ERROR] Login failed`: Login failed, check username and password
- `[ERROR] Upload failed`: Upload failed, check data format and required fields
- `[ERROR] op_name is required`: op_name is required when using script API

## Batch Upload Example

If you need to batch upload multiple reports, you can modify the data in the script and execute repeatedly:

```bash
#!/bin/bash
# Batch upload reports with different serial numbers
for sn in SN001 SN002 SN003; do
    echo "Uploading report for $sn..."
    python upload_report.py --upload --script-api --op-name admin
    sleep 1  # Avoid too frequent requests
done
```

## Integration with Automated Testing

You can call directly in test scripts:

```python
import subprocess
import sys

def upload_test_report(serial_num, result, op_name="admin"):
    """Upload test report"""
    # Note: Need to modify REPORT_DATA in upload_report.py first
    # Or create multiple different upload scripts
    
    result = subprocess.run([
        sys.executable, "upload_report.py", 
        "--upload", "--script-api", 
        "--op-name", op_name
    ], capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"Upload successful for {serial_num}")
        return True
    else:
        print(f"Upload failed for {serial_num}: {result.stderr}")
        return False

# Usage example
if upload_test_report("SN_AUTO_001", "PASS"):
    print("Test report uploaded successfully")
```

## Dynamic Report Data Modification

If you need to dynamically modify report data, you can create a wrapper function:

```python
# Add to upload_report.py
def update_report_data(**kwargs):
    """Dynamically update report data"""
    global REPORT_DATA
    for key, value in kwargs.items():
        if key in REPORT_DATA:
            REPORT_DATA[key] = value
            print(f"[INFO] Updated {key} to: {value}")

# Usage example
if __name__ == "__main__":
    # Dynamically modify data
    update_report_data(
        serial_num="SN_DYNAMIC_001",
        result="FAIL",
        op_name="test_user"
    )
    
    # Then execute normal upload process
    main()
```