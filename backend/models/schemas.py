from pydantic import BaseModel
from typing import Optional


class GenerateRequest(BaseModel):
    length: int = 16
    uppercase: bool = True
    lowercase: bool = True
    numbers: bool = True
    symbols: bool = True
    passphrase_mode: bool = False


class GenerateResponse(BaseModel):
    password: str
    entropy: float


class AnalyzeRequest(BaseModel):
    password: str


class StrengthResult(BaseModel):
    score: int           # 0–100
    level: str           # Weak / Medium / Strong / Very Strong
    entropy: float
    checks: dict         # individual rule results
    tips: list[str]


class EntropyRequest(BaseModel):
    password: str


class EntropyResponse(BaseModel):
    entropy: float
    charset_size: int