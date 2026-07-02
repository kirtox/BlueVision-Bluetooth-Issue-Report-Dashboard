from passlib.context import CryptContext
from jose import jwt
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "test-secret")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_token(username):
    return jwt.encode({"sub": username}, SECRET_KEY, algorithm="HS256")

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if username is None:
            return None
        return username
    except jwt.JWTError:
        return None


def normalize_platform(serial_num: str | None, platform: str | None) -> str | None:
    """Map (serial_num, platform) pair to short_platform name.
    
    Returns the mapped short_platform string, or None if no match found.
    """
    if not serial_num or not platform:
        return None

    platform_mapping = {
        ("0005770SP1",  "HP EliteBook 8 G2i 13 inch Notebook Next Gen AI PC"): "Merino",
        ("000577136B",  "HP EliteBook X G2i 14 inch Notebook Next Gen AI PC"): "Cashmere",
        ("0005771CT2",  "HP ZBook 8 G2i 14 inch Mobile Workstation PC"): "Merino",
        ("123456789",   "16Z90U-NDV21KB"): "Gram16",
        ("123490EN400015", "Galaxy Book6 Pro - PRHK"): "Venus 14",
        ("5KKSA00058",  "CFSC-2"): "BM241mk2",
        ("BK34HPQ25453PY", "900_MAA Product"): "N74030-012",
        ("C1L54400F9",  "HP OmniBook Ultra Laptop 14-kd0xxxC1L54400F9"): "Graham",
        ("GOU64C11AX",  "HP"): "Gouda14",
        ("PF51H6WD",    "21NSSIT019"): "Thames - 2",
        ("PF5WL21J",    "21V7SIT057"): "Avon",
        ("PF5XFNBA",    "21V9SIT046"): "Avon",
        ("TANTKD000051448", "Zenbook S14 UX5406AA_000051448"): "UX5406",
        ("N8JYKWW002606016A03400", "Aspire A14-I51M"): "Bubbletea",
        ("5CD6052407",  "HP ProBook 4 G2i 16 inch Notebook AI PC"): "Cheddar",
    }

    return platform_mapping.get((serial_num, platform))


def normalize_platform_brand(brand: str | None) -> str | None:
    """Normalize platform_brand to standard values (case-insensitive).
    
    Maps raw values to standardized names:
    HP -> HP
    LENOVO (any case) -> Lenovo
    LG Electronics -> LG
    Samsung -> Samsung
    Panasonic Connect Co., Ltd. -> Panasonic
    ASUS -> ASUS
    900_MAA -> Microsoft
    Acer -> Acer
    
    Returns original value if no match found.
    """
    if not brand:
        return brand
    
    # Normalize input: trim and lowercase for case-insensitive matching
    normalized_input = brand.strip().lower()
    
    # Mapping: lowercase key -> standard value
    brand_mapping = {
        "hp": "HP",
        "lenovo": "Lenovo",
        "lg electronics": "LG",
        "samsung": "Samsung",
        "panasonic connect co., ltd.": "Panasonic",
        "asus": "ASUS",
        "900_maa": "Microsoft",
        "acer": "Acer",
    }
    
    return brand_mapping.get(normalized_input, brand)