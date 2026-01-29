from passlib.context import CryptContext
import hashlib

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    password = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    password = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.verify(password, hashed_password)
