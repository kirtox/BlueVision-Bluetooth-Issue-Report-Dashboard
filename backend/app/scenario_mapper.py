"""
Scenario Mapper - Convert complex scenario strings to short readable names
Database remains unchanged, only used in presentation layer
"""

# Scenario pattern definitions
SCENARIO_PATTERNS = {
    "MS": {
        "keywords": ["Modern_Standby", "Idle", "Environment_Initialization"],
        "variants": {
            "Teams": {"output_check": True, "teams": "Y"},
            "Music": {"output_check": True, "teams": "N"},
        }
    },
    "S4": {
        "keywords": ["Hibernation", "Idle", "Environment_Initialization"],
        "variants": {
            "Teams": {"output_check": True, "teams": "Y"},
            "Music": {"output_check": True, "teams": "N"},
        }
    },
    "WB": {
        "keywords": ["Warm_Boot", "Idle", "Environment_Initialization"],
        "variants": {
            "Teams": {"output_check": True, "teams": "Y"},
            "Music": {"output_check": True, "teams": "N"},
        }
    },
    "CB": {
        "keywords": ["Cold_Boot", "Idle", "Environment_Initialization"],
        "variants": {
            "Teams": {"output_check": True, "teams": "Y"},
            "Music": {"output_check": True, "teams": "N"},
        }
    },
}


def get_short_scenario_name(scenario: str, microsoft_teams: str) -> str:
    """
    Return short scenario name based on scenario string and microsoft_teams field
    
    Logic:
    - Has Headset_Output_Check -> Always has Music
      - If microsoft_teams = "Y" -> Add Teams
      - Result: "MS + Music + Teams" or "MS + Music"
    - No Headset_Output_Check -> No Music, No Teams
      - Result: Just prefix like "MS", "S4", "WB", "CB"
    
    Args:
        scenario: Full scenario string, e.g. "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore"
        microsoft_teams: "Y" or "N"
    
    Returns:
        Short name, e.g. "MS + Music + Teams", "S4 + Music", or "WB", returns original scenario if no match found
    """
    if not scenario:
        return scenario
    
    scenario_lower = scenario.lower()
    has_output_check = "headset_output_check" in scenario_lower or "output_check" in scenario_lower
    
    for prefix, pattern in SCENARIO_PATTERNS.items():
        # Check if all keywords are present
        keywords_match = all(kw.lower() in scenario_lower for kw in pattern["keywords"])
        
        if keywords_match:
            # If has output_check -> always has Music
            if has_output_check:
                if microsoft_teams == "Y":
                    return f"{prefix} + Music + Teams"
                else:
                    return f"{prefix} + Music"
            else:
                # No output_check -> no Music, no Teams, just prefix
                return prefix
    
    # If no pattern matched, return original scenario
    return scenario


def get_scenario_mapping() -> dict:
    """
    Return complete scenario mapping dictionary (for frontend reference)
    
    Returns:
        Dictionary format: {"MS + Music + Teams": "Modern_Standby,Idle,...", ...}
    """
    mapping = {
        "MS + Music + Teams": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "MS + Music": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "S4 + Music + Teams": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "S4 + Music": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "WB + Music + Teams": "Warm_Boot,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "WB + Music": "Warm_Boot,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "CB + Music + Teams": "Cold_Boot,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "CB + Music": "Cold_Boot,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
    }
    return mapping


def add_short_scenario_to_report(report_dict: dict) -> dict:
    """
    Add scenario_short field to report dictionary
    
    Args:
        report_dict: Dictionary containing scenario and microsoft_teams fields
    
    Returns:
        Dictionary with added scenario_short field
    """
    if "scenario" in report_dict and "microsoft_teams" in report_dict:
        report_dict["scenario_short"] = get_short_scenario_name(
            report_dict["scenario"],
            report_dict["microsoft_teams"]
        )
    return report_dict


# Test cases
if __name__ == "__main__":
    test_cases = [
        {
            "scenario": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
            "microsoft_teams": "Y",
            "expected": "MS + Music + Teams"
        },
        {
            "scenario": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
            "microsoft_teams": "N",
            "expected": "MS + Music"
        },
        {
            "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
            "microsoft_teams": "Y",
            "expected": "S4 + Music + Teams"
        },
        {
            "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
            "microsoft_teams": "N",
            "expected": "S4 + Music"
        },
    ]
    
    print("=== Scenario Mapper Tests ===\n")
    for test in test_cases:
        result = get_short_scenario_name(test["scenario"], test["microsoft_teams"])
        status = "✓" if result == test["expected"] else "✗"
        print(f"{status} Input: {test['scenario'][:50]}...")
        print(f"  Teams: {test['microsoft_teams']}")
        print(f"  Expected: {test['expected']}")
        print(f"  Got: {result}\n")
