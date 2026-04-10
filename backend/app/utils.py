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