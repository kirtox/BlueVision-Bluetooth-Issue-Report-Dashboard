#!/usr/bin/env python3
"""
Report Upload Script
Define report data directly in the script and upload to the system
"""

import requests
import argparse
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import os
import sys
from typing import Dict, Any, Optional

# Load environment variables
env_path = Path(__file__).resolve().parents[2] / 'frontend' / '.env'
load_dotenv(dotenv_path=env_path)

# Configuration
BASE_URL = os.getenv("VITE_API_BASE_URL", "http://localhost:8000")
USERNAME = os.getenv("API_USERNAME", "admin")
PASSWORD = os.getenv("API_PASSWORD", "admin123")

# Global variable to store authentication token
AUTH_TOKEN = None

# ==================== REPORT DATA DEFINITION AREA ====================
# Define your report data directly here
REPORT_DATA = {
    "op_name": "Test",  # Must be an existing username in user table
    "date": datetime.now().isoformat(),
    "serial_num": "SN_SCRIPT_001",
    
    # Required fields
    "os_version": "26220.6760",
    "platform_brand": "Dell",
    "platform": "Tributo",
    "platform_phase": "EVT",
    "platform_bios": "BIOS_v1.0",
    "cpu": "LNL",
    "wlan": "BE200",
    "wlan_phase": "QS",
    "wifi_name": "TestWiFi",
    "wifi_band": "5GHz",
    "bt_driver": "24.0.1.1",
    "bt_interface": "PCIe",
    "wifi_driver": "24.0.0.2",
    "audio_driver": "23.43.12331.6",
    "wrt_version": "23.165.0.1",
    "wrt_preset": "Enif",
    "msft_teams_version": "1.5.00",
    
    "scenario": "Automated Script Test",
    
    # Device information
    "mouse_bt": "LE",
    "mouse_brand": "Logitech",
    "mouse": "MX Anywhere 3",
    "mouse_click_period": "Random",
    
    "keyboard_bt": "LE",
    "keyboard_brand": "Logitech",
    "keyboard": "MX Keys",
    "keyboard_click_period": "Random",
    
    "headset_bt": "LE",
    "headset_brand": "Dell",
    "headset": "Dell 5024",
    
    "speaker_bt": "Classic",
    "speaker_brand": "Jabra",
    "speaker": "Jabra 75",
    
    "phone_brand": "Samsung",
    "phone": "Galaxy S22",
    
    "device1_brand": "Other",
    "device1": "TestDevice",
    
    # Test items
    "modern_standby": "Y",
    "ms_period": "1",
    "ms_os_waiting_time": "3",
    
    "s4": "Y",
    "s4_period": "2",
    "s4_os_waiting_time": "2",
    
    "warm_boot": "Y",
    "wb_period": "3",
    "wb_os_waiting_time": "2",
    
    "cold_boot": "Y",
    "cb_period": "3",
    "cb_os_waiting_time": "2",
    
    "microsoft_teams": "Y",
    
    "apm": "N",
    "apm_period": None,
    
    "opp": "N",
    "swift_pair": "N",
    
    # Other information
    "power_type": "AC",
    "urgent_level": "P2",
    "fix_work_week": None,
    "fix_bt_driver": None,
    "jira_id": "JIRA-12345",
    "ips_id": "IPS-67890",
    "hsd_id": "HSD-11111",
    
    # Results
    "result": "PASS",
    "fail_cycles": None,
    "cycles": "5",
    "duration": "30m",
    "sys_event_log": None,
    
    "log_path": "/logs/script_upload"
}
# ==================== END OF REPORT DATA DEFINITION ====================

def login() -> bool:
    """Login and get authentication token"""
    global AUTH_TOKEN
    
    try:
        login_url = f"{BASE_URL}/auth/login"
        print(f"[AUTH] Logging in to {login_url}")
        
        response = requests.post(
            login_url,
            json={"username": USERNAME, "password": PASSWORD}
        )
        response.raise_for_status()
        data = response.json()
        AUTH_TOKEN = data.get("access_token")
        print(f"[SUCCESS] Login successful as {USERNAME}")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Login failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return False

def get_auth_headers() -> Dict[str, str]:
    """Get authentication headers"""
    if not AUTH_TOKEN:
        raise ValueError("Not authenticated. Please login first.")
    
    return {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }

def get_report_data() -> Dict[str, Any]:
    """Get report data (from REPORT_DATA constant at the top of script)"""
    # Copy data to avoid modifying the original constant
    data = REPORT_DATA.copy()
    # Update timestamp each time
    data["date"] = datetime.now().isoformat()
    return data

def upload_report(report_data: Dict[str, Any], use_script_api: bool = False) -> Optional[Dict[str, Any]]:
    """Upload report"""
    try:
        if use_script_api:
            # Use script API, no authentication required
            url = f"{BASE_URL}/reports/script"
            headers = {"Content-Type": "application/json"}
            print(f"[UPLOAD] Using script API (no auth required)")
        else:
            # Use regular API, authentication required
            url = f"{BASE_URL}/reports"
            headers = get_auth_headers()
            print(f"[UPLOAD] Using authenticated API")
        
        print(f"[UPLOAD] Uploading report to {url}")
        response = requests.post(url, json=report_data, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        print(f"[SUCCESS] Report uploaded successfully with ID: {result.get('id')}")
        return result
        
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Upload failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return None

def print_report_data():
    """Display current report data"""
    data = get_report_data()
    print("[INFO] Current report data:")
    print("=" * 50)
    for key, value in data.items():
        print(f"  {key}: {value}")
    print("=" * 50)

def main():
    parser = argparse.ArgumentParser(description="Upload report to system")
    parser.add_argument("--upload", "-u", action="store_true", help="Upload report data")
    parser.add_argument("--show", "-s", action="store_true", help="Display current report data")
    parser.add_argument("--script-api", action="store_true", help="Use script API (only validate op_name, no login required)")
    parser.add_argument("--op-name", help="Override op_name in report")
    parser.add_argument("--username", help="Login username (override environment variable)")
    parser.add_argument("--password", help="Login password (override environment variable)")
    parser.add_argument("--url", help="API base URL (override environment variable)")
    
    args = parser.parse_args()
    
    # Override configuration
    global BASE_URL, USERNAME, PASSWORD
    if args.url:
        BASE_URL = args.url
    if args.username:
        USERNAME = args.username
    if args.password:
        PASSWORD = args.password
    
    print(f"[INFO] API URL: {BASE_URL}")
    
    # Display report data
    if args.show:
        print_report_data()
        return
    
    # Upload report
    if args.upload:
        # Get report data
        report_data = get_report_data()
        
        # Override op_name if specified
        if args.op_name:
            report_data["op_name"] = args.op_name
            print(f"[INFO] Override op_name to: {args.op_name}")
        
        print(f"[INFO] Report op_name: {report_data.get('op_name')}")
        print(f"[INFO] Report serial_num: {report_data.get('serial_num')}")
        print(f"[INFO] Report scenario: {report_data.get('scenario')}")
        
        # If using script API
        if args.script_api:
            print("[INFO] Using script API mode (no authentication required)")
            
            if not report_data.get("op_name"):
                print("[ERROR] op_name is required when using script API. Use --op-name to specify.")
                sys.exit(1)
            
            # Upload directly, no login required
            result = upload_report(report_data, use_script_api=True)
            if result:
                print(f"[SUCCESS] Upload completed. Report ID: {result.get('id')}")
            else:
                print("[ERROR] Upload failed")
                sys.exit(1)
        else:
            # Use regular API, login required
            print(f"[INFO] Using authenticated API mode. Username: {USERNAME}")
            
            if not login():
                print("[ERROR] Authentication failed. Cannot proceed.")
                sys.exit(1)
            
            # Upload report
            result = upload_report(report_data, use_script_api=False)
            if result:
                print(f"[SUCCESS] Upload completed. Report ID: {result.get('id')}")
            else:
                print("[ERROR] Upload failed")
                sys.exit(1)
    else:
        print("[INFO] No action specified. Use --upload to upload report or --show to display data.")
        parser.print_help()

if __name__ == "__main__":
    main()