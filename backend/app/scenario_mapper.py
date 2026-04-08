"""
Scenario Mapper - Convert complex scenario strings to short readable names
Database remains unchanged, only used in presentation layer
"""

# Scenario pattern definitions
SCENARIO_PATTERNS = {
    "S3": {
        "keywords": ["Modern_Standby"],
        "has_mouse": True,
    },
    "S4": {
        "keywords": ["Hibernation"],
        "has_mouse": False,
    },
}


def get_short_scenario_name(scenario: str, microsoft_teams: str) -> str:
    """
    Return short scenario name based on scenario string and microsoft_teams field
    
    Logic:
    1. S3 + Mouse + Music
       - If scenario contains Modern_Standby, it has "S3 + Mouse"
       - If scenario contains Headset_output_check, check if microsoft_teams='N'
    2. S3 + Mouse + Teams
       - If scenario contains Modern_Standby, it has "S3 + Mouse"
       - If scenario contains Headset_output_check, check if microsoft_teams='Y'
    3. S4 + Music
       - If scenario contains Hibernation, it has "S4"
       - If scenario contains Headset_output_check, check if microsoft_teams='N'
    4. S4 + Teams
       - If scenario contains Hibernation, it has "S4"
       - If scenario contains Headset_output_check, check if microsoft_teams='Y'
    5. Mouse
       - If scenario doesn't contain Modern_Standby or Hibernation
       - But contains Mouse_Random_Click or Mouse_Function_Check
       - Returns "Mouse" (only once even if both keywords are present)
    
    Args:
        scenario: Full scenario string, e.g. "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check,Environment_Restore"
        microsoft_teams: "Y" or "N"
    
    Returns:
        Short name, e.g. "S3 + Mouse + Teams", "S4 + Music", "Mouse", returns original scenario if no match found
    """
    if not scenario:
        return scenario
    
    scenario_lower = scenario.lower()
    has_output_check = "headset_output_check" in scenario_lower or "output_check" in scenario_lower
    
    for prefix, pattern in SCENARIO_PATTERNS.items():
        # Check if all keywords are present
        keywords_match = all(kw.lower() in scenario_lower for kw in pattern["keywords"])
        
        if keywords_match:
            if prefix == "S3":
                # S3 always has Mouse
                if has_output_check:
                    if microsoft_teams == "Y":
                        return "S3 + Mouse + Teams"
                    else:
                        return "S3 + Mouse + Music"
                else:
                    return "S3 + Mouse"
            elif prefix == "S4":
                # S4 doesn't have Mouse
                if has_output_check:
                    if microsoft_teams == "Y":
                        return "S4 + Teams"
                    else:
                        return "S4 + Music"
                else:
                    return "S4"
    
    # Check for Mouse scenario (if not S3 or S4)
    has_mouse_check = "mouse_random_click" in scenario_lower or "mouse_function_check" in scenario_lower
    if has_mouse_check:
        return "Mouse"
    
    # If no pattern matched, return original scenario
    return scenario


# Test cases
if __name__ == "__main__":
    test_cases = [
        {
            "scenario": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check",
            "microsoft_teams": "Y",
            "expected": "S3 + Mouse + Teams"
        },
        {
            "scenario": "Modern_Standby,Idle,Environment_Initialization,Headset_Output_Check",
            "microsoft_teams": "N",
            "expected": "S3 + Mouse + Music"
        },
        {
            "scenario": "Modern_Standby,Idle,Environment_Initialization",
            "microsoft_teams": "Y",
            "expected": "S3 + Mouse"
        },
        {
            "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check",
            "microsoft_teams": "Y",
            "expected": "S4 + Teams"
        },
        {
            "scenario": "Hibernation,Idle,Environment_Initialization,Headset_Output_Check",
            "microsoft_teams": "N",
            "expected": "S4 + Music"
        },
        {
            "scenario": "Hibernation,Idle,Environment_Initialization",
            "microsoft_teams": "N",
            "expected": "S4"
        },
        {
            "scenario": "Hibernation,Idle,Environment_Initialization",
            "microsoft_teams": "Y",
            "expected": "S4"
        },
        {
            "scenario": "Idle,Mouse_Random_Click",
            "microsoft_teams": "N",
            "expected": "Mouse"
        },
        {
            "scenario": "Mouse_Function_Check,Idle",
            "microsoft_teams": "Y",
            "expected": "Mouse"
        },
        {
            "scenario": "Mouse_Random_Click,Mouse_Function_Check",
            "microsoft_teams": "N",
            "expected": "Mouse"
        },
    ]
    
    print("=== Scenario Mapper Tests ===")
    for test in test_cases:
        result = get_short_scenario_name(test["scenario"], test["microsoft_teams"])
        status = "✓" if result == test["expected"] else "✗"
        print(f"{status} Input: {test['scenario'][:50]}...")
        print(f"  Teams: {test['microsoft_teams']}")
        print(f"  Expected: {test['expected']}")
        print(f"  Got: {result}\n")
