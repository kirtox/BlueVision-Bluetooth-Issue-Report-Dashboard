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
    
    Args:
        scenario: Full scenario string, e.g. "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore"
        microsoft_teams: "Y" or "N"
    
    Returns:
        Short name, e.g. "MS+Teams" or "S4+Music", returns original scenario if no match found
    """
    if not scenario:
        return scenario
    
    scenario_lower = scenario.lower()
    has_output_check = "headset_output_check" in scenario_lower or "output_check" in scenario_lower
    
    for prefix, pattern in SCENARIO_PATTERNS.items():
        # Check if all keywords are present
        keywords_match = all(kw.lower() in scenario_lower for kw in pattern["keywords"])
        
        if keywords_match:
            # Check variants
            for variant_name, conditions in pattern["variants"].items():
                # Check if output_check is required
                if conditions.get("output_check", False) and not has_output_check:
                    continue
                
                # Check microsoft_teams field
                if conditions.get("teams") == microsoft_teams:
                    return f"{prefix}+{variant_name}"
            
            # If no variant matched but basic pattern did, return prefix
            return prefix
    
    # If no pattern matched, return original scenario
    return scenario


def get_scenario_mapping() -> dict:
    """
    Return complete scenario mapping dictionary (for frontend reference)
    
    Returns:
        Dictionary format: {"MS+Teams": "Modern_Standby,Idle,...", ...}
    """
    mapping = {
        "MS+Teams": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "MS+Music": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "S4+Teams": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "S4+Music": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "WB+Teams": "Warm_Boot,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "WB+Music": "Warm_Boot,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "CB+Teams": "Cold_Boot,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
        "CB+Music": "Cold_Boot,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
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
            "expected": "MS+Teams"
        },
        {
            "scenario": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
            "microsoft_teams": "N",
            "expected": "MS+Music"
        },
        {
            "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
            "microsoft_teams": "Y",
            "expected": "S4+Teams"
        },
        {
            "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore",
            "microsoft_teams": "N",
            "expected": "S4+Music"
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
