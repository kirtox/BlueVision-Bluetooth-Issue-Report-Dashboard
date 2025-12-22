import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
import os

from sqlalchemy import Null, null

# Specify the path to .env (from backend/app back to BTIRD)
env_path = Path(__file__).resolve().parents[2] / 'frontend' / '.env'  # Back to BTIRD folder
load_dotenv(dotenv_path=env_path)

# Load parameter
BASE_URL = os.getenv("VITE_API_BASE_URL")
print(f"VITE_API_BASE_URL: {BASE_URL}")

# API_REPORTS = f"{API_URL}/reports"
# API_PLATFORMS = f"{API_URL}/platforms"

# Dev Env.
# BASE_URL = "http://localhost:8000"

# Prod Env.
# BASE_URL = "http://ServerIP:8001"

def test_create_report():
    payload = {
        "op_name": "Ernie", # Not null (None)
        "date": datetime.now().isoformat(),   # Pydantic datetime format
        "serial_num": "SN123456", # Not null (None)

        "os_version": "26220.6760", # Not null (None)
        "platform_brand": "Dell", # Not null (None)
        "platform": "Tributo", # Not null (None)
        "platform_phase": "EVT", # Not null (None)
        "platform_bios": "BIOS_v1.0", # Not null (None)
        "cpu": "LNL", # Not null (None)
        "wlan": "BE200", # Not null (None)
        "wlan_phase": "QS", # Not null (None)
        "bt_driver": "24.0.1.1", # Not null (None)
        "bt_interface": "PCIe", # Not null (None)
        "wifi_driver": "24.0.0.2", # Not null (None)
        "audio_driver": "23.43.12331.6", # Not null (None)
        "wrt_version": "23.165.0.1", # Not null (None)
        "wrt_preset": "Enif", # Not null (None)
        "msft_teams_version": "1.5.00", 

        "scenario": "MS + S4 + WB + CB + Teams Call", # Not null (None)

        "mouse_bt": "LE",
        "mouse_brand": "Logitech",
        "mouse": "MX Anywhere 3",
        "mouse_click_period": "Random",

        "keyboard_bt": "LE",
        "keyboard_brand": "Logitech",
        "keyboard": "MX Keys",

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

        "modern_standby": "Y", # Not null (None)
        "ms_period": "1",
        "ms_os_waiting_time": "3",

        "s4": "Y", # Not null (None)
        "s4_period": "2",
        "s4_os_waiting_time": "2",

        "warm_boot": "Y", # Not null (None)
        "wb_period": "3",

        "cold_boot": "Y", # Not null (None)
        "cb_period": "3",

        "microsoft_teams": "Y", # Not null (None)

        "apm": "N", # Not null (None)
        "opp": "N", # Not null (None)
        "swift_pair": "N", # Not null (None)

        "power_type": "AC", # Not null (None)
        "urgent_level": "P1",
        "jira_id": "JIRA-123",

        "result": "PASS", # Not null (None)
        "cycles": "5",
        "duration": "108000",  # 30 hours in seconds
        "log_path": "/logs/report1"
    }

    response = requests.post(f"{BASE_URL}/reports", json=payload)
    print("Status:", response.status_code)
    print("Response:", response.json())
    assert response.status_code == 200
    return response.json()["id"]

def test_update_report(report_id):
    print(f"Update report: {report_id}")
    payload = {
        "platform_brand": "AMD",
        "result": "FAIL",
        "fail_cycles": None,
        "cycles": "7"
    }
    response = requests.patch(f"{BASE_URL}/reports/{report_id}", json=payload)
    print("Update:", response.json())
    assert response.status_code == 200

def test_delete_report(report_id):
    response = requests.delete(f"{BASE_URL}/reports/{report_id}")
    print("Delete:", response.text)
    assert response.status_code == 200


if __name__ == "__main__":
    report_id = test_create_report()
    print(f"Report ID: {report_id}")
    # test_update_report(120)
    # test_delete_report(120)
