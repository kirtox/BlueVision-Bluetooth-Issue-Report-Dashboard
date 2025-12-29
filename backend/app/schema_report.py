from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    op_name: Optional[str] = None
    date: Optional[datetime] = None
    serial_num: Optional[str] = None

    os_version: Optional[str] = None
    platform_brand: Optional[str] = None
    platform: Optional[str] = None
    platform_phase: Optional[str] = None
    platform_bios: Optional[str] = None
    cpu: Optional[str] = None
    cpu_codename: Optional[str] = None
    wlan: Optional[str] = None
    wlan_phase: Optional[str] = None
    wifi_name: Optional[str] = None
    wifi_band: Optional[str] = None
    bt_driver: Optional[str] = None
    bt_interface: Optional[str] = None
    wifi_driver: Optional[str] = None
    audio_driver: Optional[str] = None
    wrt_version: Optional[str] = None
    wrt_preset: Optional[str] = None
    msft_teams_version: Optional[str] = None

    scenario: Optional[str] = None

    mouse_bt: Optional[str] = None
    mouse_brand: Optional[str] = None
    mouse: Optional[str] = None
    mouse_click_period: Optional[str] = None

    keyboard_bt: Optional[str] = None
    keyboard_brand: Optional[str] = None
    keyboard: Optional[str] = None
    keyboard_click_period: Optional[str] = None

    headset_bt: Optional[str] = None
    headset_brand: Optional[str] = None
    headset: Optional[str] = None
    
    speaker_bt: Optional[str] = None
    speaker_brand: Optional[str] = None
    speaker: Optional[str] = None

    phone_brand: Optional[str] = None
    phone: Optional[str] = None

    device1_brand: Optional[str] = None
    device1: Optional[str] = None

    modern_standby: Optional[str] = None
    ms_period: Optional[str] = None
    ms_os_waiting_time: Optional[str] = None

    s4: Optional[str] = None
    s4_period: Optional[str] = None
    s4_os_waiting_time: Optional[str] = None

    warm_boot: Optional[str] = None
    wb_period: Optional[str] = None
    wb_os_waiting_time: Optional[str] = None

    cold_boot: Optional[str] = None
    cb_period: Optional[str] = None
    cb_os_waiting_time: Optional[str] = None

    microsoft_teams: Optional[str] = None

    apm: Optional[str] = None
    apm_period: Optional[str] = None
    
    opp: Optional[str] = None
    swift_pair: Optional[str] = None

    power_type: Optional[str] = None
    urgent_level: Optional[str] = None
    fix_work_week: Optional[str] = None
    fix_bt_driver: Optional[str] = None
    jira_id: Optional[str] = None
    ips_id: Optional[str] = None
    hsd_id: Optional[str] = None

    result: Optional[str] = None
    fail_cycles: Optional[str] = None
    cycles: Optional[str] = None
    duration: Optional[str] = None
    sys_event_log: Optional[str] = None

    log_path: Optional[str] = None
    comment: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportUpdate(ReportBase):
    pass

class ReportInDB(ReportBase):
    id: int
    
    model_config = {
        "from_attributes": True
    }

# Backup #
# op_name: Optional[str] = None
# date: Optional[datetime] = None

# os_version: Optional[str] = None
# platform_brand: Optional[str] = None
# platform: Optional[str] = None
# platform_phase: Optional[str] = None
# platform_bios: Optional[str] = None
# cpu: Optional[str] = None
# wlan: Optional[str] = None
# wlan_phase: Optional[str] = None
# bt_driver: Optional[str] = None
# bt_interface: Optional[str] = None
# wifi_driver: Optional[str] = None
# audio_driver: Optional[str] = None
# wrt_version: Optional[str] = None
# wrt_preset: Optional[str] = None
# msft_teams_version: Optional[str] = None
# scenario: Optional[str] = None

# mouse_brand: Optional[str] = None
# mouse: Optional[str] = None
# mouse_click_period: Optional[str] = None

# keyboard_brand: Optional[str] = None
# keyboard: Optional[str] = None
# keyboard_click_period: Optional[str] = None

# headset_brand: Optional[str] = None
# speaker_brand: Optional[str] = None
# phone_brand: Optional[str] = None
# device1_brand: Optional[str] = None
# device1: Optional[str] = None

# modern_standby: Optional[str] = None
# ms_period: Optional[str] = None
# ms_os_waiting_time: Optional[str] = None

# s4: Optional[str] = None
# s4_period: Optional[str] = None
# s4_os_waiting_time: Optional[str] = None

# warm_boot: Optional[str] = None
# wb_period: Optional[str] = None
# wb_os_waiting_time: Optional[str] = None

# cold_boot: Optional[str] = None
# cb_period: Optional[str] = None
# cb_os_waiting_time: Optional[str] = None

# microsoft_teams: Optional[str] = None
# apm: Optional[str] = None
# apm_period: Optional[str] = None
# opp: Optional[str] = None
# swift_pair: Optional[str] = None

# power_type: Optional[str] = None
# urgent_level: Optional[str] = None
# fix_work_week: Optional[str] = None
# fix_bt_driver: Optional[str] = None
# jira_id: Optional[str] = None
# ips_id: Optional[str] = None
# hsd_id: Optional[str] = None

# result: Optional[str] = None
# fail_rate: Optional[str] = None
# current_status: Optional[str] = None
# log_path: Optional[str] = None