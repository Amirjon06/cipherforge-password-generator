from fastapi import APIRouter, HTTPException
from models.schemas import (
    GenerateRequest, GenerateResponse,
    AnalyzeRequest, StrengthResult,
    EntropyRequest, EntropyResponse,
)
from services.generator import generate_password, generate_passphrase, calculate_entropy
from services.analyzer import analyze_password

router = APIRouter(prefix="/api/password", tags=["password"])


@router.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    if req.passphrase_mode:
        password, entropy = generate_passphrase(word_count=4)
    else:
        length = max(4, min(req.length, 128))
        if not any([req.uppercase, req.lowercase, req.numbers, req.symbols]):
            raise HTTPException(status_code=400, detail="At least one character type must be selected")
        password, entropy = generate_password(
            length=length,
            uppercase=req.uppercase,
            lowercase=req.lowercase,
            numbers=req.numbers,
            symbols=req.symbols,
        )
    return GenerateResponse(password=password, entropy=entropy)


@router.post("/analyze", response_model=StrengthResult)
async def analyze(req: AnalyzeRequest):
    result = analyze_password(req.password)
    return StrengthResult(**result)


@router.post("/entropy", response_model=EntropyResponse)
async def entropy(req: EntropyRequest):
    value, charset_size = calculate_entropy(req.password)
    return EntropyResponse(entropy=value, charset_size=charset_size)