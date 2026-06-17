import re

def identify_intel_cpu(cpu_name):
    cpu_name = cpu_name.upper()
    
    # 1. Identify Core Ultra series (latest naming convention)
    if "ULTRA" in cpu_name:
        # Extract the first digit after Ultra series (e.g., 1xx, 2xx, 3xx, X7, etc.)
        # Support formats like: Ultra 7 358H, Ultra X7 358H, Ultra 5 238V
        match = re.search(r'ULTRA\s+(?:X?(\d)|\d+)\s*(\d{3})', cpu_name)
        if match:
            # Get the series number (first digit of the model number)
            series = match.group(1) if match.group(1) else match.group(2)[0]
            model_number = match.group(2)
            
            if series == '4' or model_number.startswith('4'):
                return "Nova Lake"
            elif series == '3' or model_number.startswith('3'):
                return "Panther Lake"
            elif series == '2' or model_number.startswith('2'):
                # Series 2 has two branches, simple distinction: V for Lunar Lake, others/S for Arrow Lake
                if 'V' in cpu_name:
                    return "Lunar Lake"
                return "Arrow Lake"
            elif series == '1' or model_number.startswith('1'):
                return "Meteor Lake"
    
    # 2. Identify traditional Core i series (11th-14th generation)
    # Extract formats like i7-1185G7 or i9-14900K
    match_i = re.search(r'I\d[- ](\d{2})', cpu_name)
    if match_i:
        gen = match_i.group(1)
        if gen == '14':
            return "Raptor Lake Refresh"
        elif gen == '13':
            return "Raptor Lake"
        elif gen == '12':
            return "Alder Lake"
        elif gen == '11':
            # 11th generation desktop and laptop architectures are different
            if 'G' in cpu_name:
                return "Tiger Lake"
            return "Rocket Lake"

    # 3. Identify Core series without "Ultra" and without "i" (e.g., Core 5 320U, Core 3 3XXU)
    # Handles mainstream/entry-level branding (no Ultra, no i-prefix)
    if "CORE" in cpu_name and "ULTRA" not in cpu_name:
        match_core = re.search(r'CORE(?:\(TM\))?\s+\d\s+(\d{3})', cpu_name)
        if match_core:
            series = match_core.group(1)[0]  # First digit of model number
            if series == '3':
                return "Wildcat Lake"

    return "Unknown"

# --- Test cases ---
test_cpus = [
    # "Intel(R) Core(TM) Ultra 7 358H",
    # "Intel(R) Core(TM) Ultra 5 338H",
    # "11th Gen Intel(R) Core(TM) i7-1185G7",
    # "Intel(R) Core(TM) Ultra 7 164U",
    # "Intel Core i9-14900K"
    # "Intel(R) Core(TM) Ultra 5 338H",
    # "Intel(R) Core(TM) Ultra X7 358H",
    # "Intel(R) Core(TM) Ultra 5 238V"
    "Intel(R) Core(TM) 7 360",
    "Intel(R) Core(TM) 7 350"
]

for cpu in test_cpus:
    print(f"Input: {cpu}")
    print(f"Result: {identify_intel_cpu(cpu)}\n")