import os
import math
import time
import random
import datetime
import requests
import threading
import numpy as np
import pandas as pd
from pathlib import Path
from dotenv import load_dotenv

# === Settings ===
BASE_DIR = Path(__file__).resolve().parent
EXCEL_FILE = BASE_DIR / "BTIRD.xlsx"
SHEET_REPORT = "Dell_Report_Data"         # Target sheet name
SHEET_PLATFORM = "Dell_Platform_Data"     # Target sheet name

# Specify the path to .env (from backend/app back to BTIRD)
env_path = Path(__file__).resolve().parents[2] / 'frontend' / '.env'  # Back to BTIRD folder
load_dotenv(dotenv_path=env_path)

# Load parameter
API_URL = os.getenv("VITE_API_BASE_URL")
print(f"VITE_API_BASE_URL: {API_URL}")

API_REPORTS = f"{API_URL}/reports"
API_PLATFORMS = f"{API_URL}/platforms"


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Clean DataFrame: Deal with NaN / Timestamp"""
    # 1. Transfer float nan, numpy NaN, "nan" to None
    df = df.replace({np.nan: "", "nan": "", "NaN": ""})

    # 2. Deal with datetime column → isoformat()
    for col in df.select_dtypes(include=["datetime64[ns]"]).columns:
        df[col] = df[col].apply(lambda x: x.isoformat() if pd.notnull(x) else None)

    return df


def create_report_data_single():
    df = pd.read_excel(EXCEL_FILE, sheet_name=SHEET_REPORT, dtype=str)
    df = clean_dataframe(df)

    if "id" in df.columns:
        df = df.drop(columns=["id"])  # Delete id column

    json_data = df.to_dict(orient="records")

    print("[INFO] Start to import each data to Report table...")
    for i, record in enumerate(json_data, start=1):
        # print(f"{i}: {record}")
        try:
            response = requests.post(f"{API_URL}/reports", json=record, timeout=30)
            if response.status_code in (200, 201):
                print(f"[OK] Report id({i}) import successfully")
            else:
                print(f"[FAIL] Report id({i}) import failed: {response.status_code}, {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] Report id({i}) is abnormal: {e}")

def create_platform_data_single():
    df = pd.read_excel(EXCEL_FILE, sheet_name=SHEET_PLATFORM, dtype=str)
    df = clean_dataframe(df)
    json_data = df.to_dict(orient="records")

    print("[INFO] Start to import each data to Platform table...")
    for i, record in enumerate(json_data, start=1):
        try:
            response = requests.post(f"{API_URL}/platforms", json=record, timeout=30)
            if response.status_code in (200, 201):
                print(f"[OK] Platform id({i}) import successfully")
            else:
                print(f"[FAIL] Platform id({i}) import failed: {response.status_code}, {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] Platform id({i}) is abnormal: {e}")

def simulate_platform_status(serial_num: str):
    """
    Update specific platform status per 5 seconds
    - Online  → Running or Offline
    - Running → Online
    - Offline → Online
    """
    while True:
        try:
            # 1. Query platform (by using API: "/platforms/search_by_sn/{serial_num}")
            response = requests.get(f"{API_PLATFORMS}/search_by_sn/{serial_num}", timeout=10)
            if response.status_code != 200:
                print(f"[ERROR] Get platform {serial_num} failed: {response.status_code}, {response.text}")
                time.sleep(10)
                continue

            platform = response.json()
            if not platform:
                print(f"[WARN] Platform with serial_num={serial_num} not found.")
                time.sleep(10)
                continue
            print("platform: ", platform)
            platform_id = platform["id"]
            current_status = platform["current_status"]

            # 2. Determine next status
            if current_status == "Online":
                new_status = random.choice(["Running", "Offline"])
            elif current_status == "Running":
                new_status = "Online"
            elif current_status == "Offline":
                new_status = "Online"
            else:
                print(f"[WARN] Unknown status '{current_status}', force set to 'Online'")
                new_status = "Online"

            # 3. Update status
            # Get current datetime
            now = datetime.datetime.now()

            # Format: 2025-09-03 17:10:15
            formatted_date = now.strftime("%Y-%m-%d %H:%M:%S")
            update_data = {"date": formatted_date, "serial_num": serial_num, "current_status": new_status}
            print(f"[id: {platform_id}] update_data: {update_data}")
            put_resp = requests.put(f"{API_PLATFORMS}/{platform_id}", json=update_data, timeout=10)

            if put_resp.status_code in (200, 201):
                print(f"[OK] {serial_num} status updated: {current_status} → {new_status}")
            else:
                print(f"[FAIL] {serial_num} update failed: {put_resp.status_code}, {put_resp.text}")

        except requests.exceptions.RequestException as e:
            print(f"[ERROR] {serial_num} exception: {e}")

        time.sleep(5)


def simulate_multiple_platforms(serial_nums: list[str]):
    """
    Simulate few platforms simultaneously, and change each platform status
    """
    threads = []
    for sn in serial_nums:
        t = threading.Thread(target=simulate_platform_status, args=(sn,), daemon=True)
        t.start()
        threads.append(t)

    # Make sure the main program still is running, and avoid the threads to be closed
    for t in threads:
        t.join()

if __name__ == "__main__":
    print("post_dell_data.py running...")

    # Import Dell report data
    print("create_report_data_single() running...")
    create_report_data_single()
    print("create_report_data_single() end")

    # Import Dell platform data
    print("create_platform_data_single() running...")
    create_platform_data_single()
    print("create_platform_data_single() end")

    # Simulate few platforms simultaneously, and change each platform status
    # simulate_multiple_platforms([
    #     "5RYD064",
    #     "WWF342X",
    #     "BITS007",
    #     "QWER001"
    # ])