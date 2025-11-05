
import os
import time
import random
import requests
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Specify the path to .env (from backend/app back to BTIRD)
env_path = Path(__file__).resolve().parents[2] / 'frontend' / '.env'  # Back to BTIRD folder
load_dotenv(dotenv_path=env_path)

# Load parameter
API_URL = os.getenv("VITE_API_BASE_URL")
print(f"VITE_API_BASE_URL: {API_URL}")

# API_URL = "http://localhost:8000/reports"  # Change to your FastAPI service URL

# === Data Definition ===
op_name = ["Ernie", "Tony", "Alex", "Angus", "Ben", "Fiona"]
serial_num = {
    "Regis": ["622341264479122", "303621461704379"], "Trekker": ["603757811140431", "457471291662564"], "Masada": ["468005824512677", "706055898196153"], 
    "Thames2": ["997918224905674", "161998895303213"], "Curle": ["470804706495200", "785745431065530"], 
    "Taroko": ["639529702605165", "562743853422310"], "Tributo": ["085956185209698", "963355246872600"], 
    "Venus5-16": ["821133815186250", "082675767235281"], "Surface": ["534100923605487", "922914444683890"], 
    "DualPlay": ["543036661905098", "624087830741545"], "NitroBlaze7": ["804587742061783", "731420553518466"], 
    "Dali": ["641621182654680", "710338712422480"], "Precog": ["816837056742685", "081934550767478"], 
    "RVP": ["889628435761245", "768000973226214"], 
}
serial_num_list = [
    "622341264479122",
    "303621461704379",
    "603757811140431",
    "457471291662564",
    "468005824512677",
    "706055898196153",
    "997918224905674",
    "161998895303213",
    "470804706495200",
    "785745431065530",
    "639529702605165",
    "562743853422310",
    "085956185209698",
    "963355246872600",
    "821133815186250",
    "082675767235281",
    "534100923605487",
    "922914444683890",
    "543036661905098",
    "624087830741545",
    "804587742061783",
    "731420553518466",
    "641621182654680",
    "710338712422480",
    "816837056742685",
    "081934550767478",
    "889628435761245",
    "768000973226214"
]

os_version = ["26100.4656", "22631.5624", "22621.5624", "22631.5472"]
platform_brand = ["HP", "Lenovo", "Dell", "Samsung", "Microsoft", "Acer", "Asus", "Intel"]
platform = {
    "HP": ["Regis", "Trekker", "Masada"],
    "Lenovo": ["Thames2", "Curle"],
    "Dell": ["Taroko", "Tributo"],
    "Samsung": ["Venus5-16"],
    "Microsoft": ["Surface"],
    "Acer": ["DualPlay", "NitroBlaze7"],
    "Asus": ["Dali", "Precog"],
    "Intel": ["RVP"]
}
platform_phase = ["EVT", "DVT1", "DVT2", "PV", "MP"]
platform_bios = {
    "HP": ["B 02|03", "A 02|03", "01.14.00", "01.16.00"],
    "Lenovo": ["N4BET34Z", "N4CAT2A1"],
    "Dell": ["89.7.31", "89.8.35", "89.9.39"],
    "Samsung": ["P05AMA. 140.250210.01", "P06AMA. 170.250220.01"],
    "Microsoft": ["24.091.12892.0", "24.091.12921.0", "24.092.12878.0"],
    "Acer": ["3A20", "3A29", "3A31"],
    "Asus": ["310", "202", "304", "322"],
    "Intel": ["R000.3234.D01.2506101609", "R000.3334.D01.2515202509"]
}
cpu = ["MTL", "ARL", "LNL", "PTL"]
wlan = ["AX211", "AX201", "BE200", "BE202", "BE211"]
wlan_phase = ["A0", "B0"]
bt_driver = ["23.165.0.3", "23.165.0.4", "23.165.0.7", "23.160.0.9", "23.130.0.3"]
bt_interface = ["USB", "PCIe"]
wifi_driver = ["99.0.96.3", "23.140.0.5", "23.160.0.4"]
audio_driver = ["20.43.11968.4", "20.43.12153.0", "20.43.12196.0"]
wrt_version = ["23.140.0.5", "23.150.0.4", "23.160.0.5"]
wrt_preset = ["Enif", "Mimosa", "Gacrux"]
msft_teams_version = ["25153.1010.3727.5483", "25151.505.3727.5755", None]
scenario = ["Teams Call", "Mouse Click (2/3/5 sec) + Play local music", "Teams Call + Play local music + S4", "Mouse click", "Teams Call + MS"]
mouse_brand = ["Logitech", "HP", "Dell", "Microsoft", ""]
mouse = {
    "Logitech": ["MX Anywhere 2S", "MX Anywhere 3S", "MX Anywhere 3"],
    "HP": ["690", "695"],
    "Dell": ["MS116", "WM126", "MS5120W"],
    "Microsoft": ["Precision", "Surface Arc", "Surface"],
    "": [""]
}
mouse_click_period = ["Random", "2", "3", "4", "5", ""]
keyboard_brand = ["Logitech", "Microsoft", ""]
keyboard = {
    "Logitech": ["MX 2S", "MX 3S", "MX 3"],
    "Microsoft": ["Precision", "Surface Arc", "Surface"],
    "": [""]
}
keyboard_click_period = mouse_click_period
headset_brand = ["Logitech", "Dell", ""]
headset = {
    "Logitech": ["Zone Vibe 100", "Zone Vibe 125"],
    "Dell": ["WL3024", "WL5024", "WL7024"],
    "": [""]
}
speaker_brand = ["Sony", "Bose", "JBL", "Marshall", ""]
speaker = {
    "Sony": ["ULT-Field", "SRS-XG300", "HT-A7000"],
    "Bose": ["SoundLink Revolve II", "Smart Soundbar 900"],
    "JBL": ["Charge 5", "PartyBox 310"],
    "Marshall": ["Emberton II", "Woburn III"],
    "": [""]
}
phone_brand = ["Samsung", "Apple", ""]
phone = {
    "Samsung": ["S25 Ultra", "S25 Edge", "Z Fold 7"],
    "Apple": ["iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max"],
    "": [""]
}
modern_standby = ["Y", "N"]
common_period = ["3", "4", "5", ""]
yn = ["Y", "N"]
power_type = ["AC", "DC"]
urgent_level = ["Fireball", "P1", "P2", "P3", ""]
fix_work_week = [f"WW{str(i).zfill(2)}" for i in range(1, 53)] + [""]
fix_bt_driver = ["23.180.0.3", "23.180.0.5", ""]
result = ["Pass", "Fail", "On-Going"]
fail_rate = {
    "Pass": ["0/200", "0/4207", "0/1000"],
    "Fail": ["1/300", "5/13245", "2/60"],
    "On-Going": [""]
}
fail_cycles = {
    "Pass": ["0"],
    "Fail": ["1", "2", "3", "4", "5"],
    "On-Going": [""]
}
cycles = ["10", "100", "200", "300", "400", "500", "1000", "2000"]
cycles = {
    "Pass": ["10", "100", "200", "300", "400", "500", "1000", "2000"],
    "Fail": ["10", "100", "200", "300", "400", "500", "1000", "2000"],
    "On-Going": [""]
}
current_status = ["Online", "Running", "Offline"]
log_path = ["https://www.intel.com/content/www/us/en/homepage.html", None]

def random_date_2025():
    start = datetime(2025, 1, 1)
    end = datetime(2025, 12, 31, 23, 59, 59)
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def generate_random_report():
    pb = random.choice(platform_brand)
    selected_platform = random.choice(platform[pb])
    mb = random.choice(mouse_brand)
    kb = random.choice(keyboard_brand)
    hs = random.choice(headset_brand)
    sp = random.choice(speaker_brand)
    ph = random.choice(phone_brand)

    r = {
        "op_name": random.choice(op_name),
        "date": random_date_2025().isoformat(),
        "serial_num": random.choice(serial_num[selected_platform]),
        "os_version": random.choice(os_version),
        "platform_brand": pb,
        "platform": selected_platform,
        "platform_phase": random.choice(platform_phase),
        "platform_bios": random.choice(platform_bios[pb]),
        "cpu": random.choice(cpu),
        "wlan": random.choice(wlan),
        "wlan_phase": random.choice(wlan_phase),
        "bt_driver": random.choice(bt_driver),
        "bt_interface": random.choice(bt_interface),
        "wifi_driver": random.choice(wifi_driver),
        "audio_driver": random.choice(audio_driver),
        "wrt_version": random.choice(wrt_version),
        "wrt_preset": random.choice(wrt_preset),
        "msft_teams_version": random.choice(msft_teams_version),
        "scenario": random.choice(scenario),
        "mouse_brand": mb,
        "mouse": random.choice(mouse[mb]),
        "mouse_click_period": random.choice(mouse_click_period),
        "keyboard_brand": kb,
        "keyboard": random.choice(keyboard[kb]),
        "keyboard_click_period": random.choice(keyboard_click_period),
        "headset_brand": hs,
        "speaker_brand": sp,
        "phone_brand": ph,
        "device1_brand": "",
        "device1": "",
        "modern_standby": random.choice(yn),
        "ms_period": random.choice(common_period),
        "ms_os_waiting_time": random.choice(common_period),
        "s4": random.choice(yn),
        "s4_period": random.choice(common_period),
        "s4_os_waiting_time": random.choice(common_period),
        "warm_boot": random.choice(yn),
        "wb_period": random.choice(common_period),
        "wb_os_waiting_time": random.choice(common_period),
        "cold_boot": random.choice(yn),
        "cb_period": random.choice(common_period),
        "cb_os_waiting_time": random.choice(common_period),
        "microsoft_teams": random.choice(yn),
        "apm": random.choice(yn),
        "apm_period": random.choice(common_period),
        "opp": "N",
        "swift_pair": "N",
        "power_type": random.choice(power_type),
        "urgent_level": random.choice(urgent_level),
        "fix_work_week": random.choice(fix_work_week),
        "fix_bt_driver": random.choice(fix_bt_driver),
        "jira_id": "",
        "ips_id": "",
        "hsd_id": "",
        "result": (res := random.choice(result)),
        # "fail_rate": random.choice(fail_rate[res]),
        "fail_cycles": random.choice(fail_cycles[res]),
        "cycles": random.choice(cycles[res]),
        # "current_status": random.choice(current_status),
        "log_path": random.choice(log_path)
    }
    return r

def post_report():
    data = generate_random_report()
    response = requests.post(API_URL, json=data)
    print(f"Status: {response.status_code}")
    print(response.json())

def generate_random_platform(sn: str):
    r = {
        "date": random_date_2025().isoformat(),
        # "serial_num": random.choice(serial_num[platform]),
        "serial_num": sn,
        "current_status": random.choice(current_status)
    }
    return r

def upsert_platform(sn: str):
    """If serial_num exists -> update, otherwise create new"""
    # 1. First check if serial_num exists
    check_url = f"{API_URL}/platforms?serial_num={sn}"
    response = requests.get(check_url)

    if response.status_code == 200:
        data = response.json()
        if data:  # Found data, perform update
            platform_id = data["id"] if isinstance(data, dict) else data[0]["id"]
            update_url = f"{API_URL}/platforms/{platform_id}"
            new_data = generate_random_platform(sn)
            res = requests.put(update_url, json=new_data)
            print(f"✅ Updated platform {sn}: {res.status_code}, {response.json()}")
        else:
            # Not found, create new
            insert_platform(sn)
    else:
        print(f"⚠️ Failed to check platform: {response.status_code}, {response.text}")

def insert_platform(sn: str):
    """Add platform data"""
    url = f"{API_URL}/platforms"
    data = generate_random_platform(sn)
    response = requests.post(url, json=data)
    print(f"✅ Inserted platform {sn}: {response.status_code}, {response.json()}")


if __name__ == "__main__":
    for _ in range(1):
        print(f"report_data: {generate_random_report()}")
        # report_data = generate_random_report()
        # response = requests.post(API_URL+"/reports", json=report_data)
        # print(f"Status: {response.status_code}, Response: {response.json()}")

    # while True:
    #     for sn in serial_num_list:
    #         # platform_data = generate_random_platform(sn)
    #         # print(f"platform_data: {platform_data}")
    #         # response = requests.post(API_URL+"/platforms", json=platform_data)
    #         # print(f"Status: {response.status_code}, Response: {response.json()}")
    #         upsert_platform(sn)
    #     time.sleep(5)