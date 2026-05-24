import string
import re
from services.generator import calculate_entropy


def analyze_password(password: str) -> dict:
    if not password:
        return {
            "score": 0,
            "level": "Weak",
            "entropy": 0.0,
            "checks": {},
            "tips": ["Enter a password to analyze"],
        }

    length = len(password)
    checks = {
        "length_ok": length >= 12,
        "length_great": length >= 16,
        "has_uppercase": any(c.isupper() for c in password),
        "has_lowercase": any(c.islower() for c in password),
        "has_numbers": any(c.isdigit() for c in password),
        "has_symbols": any(c in string.punctuation for c in password),
        "no_repeats": not bool(re.search(r"(.)\1{2,}", password)),
        "no_sequences": not _has_sequences(password),
        "length": length,
    }

    score = _calculate_score(checks, length)
    level = _score_to_level(score)
    tips = _generate_tips(checks)
    entropy, _ = calculate_entropy(password)

    return {
        "score": score,
        "level": level,
        "entropy": round(entropy, 2),
        "checks": checks,
        "tips": tips,
    }


def _has_sequences(password: str) -> bool:
    lower = password.lower()
    sequences = ["abcdefghijklmnopqrstuvwxyz", "0123456789", "qwertyuiop", "asdfghjkl"]
    for seq in sequences:
        for i in range(len(seq) - 2):
            if seq[i:i+3] in lower:
                return True
    return False


def _calculate_score(checks: dict, length: int) -> int:
    score = 0

    # Length scoring — gradual, not generous
    if length >= 6:   score += 5
    if length >= 8:   score += 5
    if length >= 12:  score += 10
    if length >= 16:  score += 10
    if length >= 20:  score += 5

    # Character variety
    if checks["has_uppercase"]: score += 10
    if checks["has_lowercase"]: score += 10
    if checks["has_numbers"]:   score += 10
    if checks["has_symbols"]:   score += 20

    # Penalties for bad patterns
    if not checks["no_repeats"]:   score -= 10
    if not checks["no_sequences"]: score -= 10

    # Bonus only if ALL character types present
    if all([checks["has_uppercase"], checks["has_lowercase"],
            checks["has_numbers"], checks["has_symbols"]]):
        score += 10

    # Extra bonus for long + complex
    if length >= 16 and checks["has_symbols"]:
        score += 5

    return max(0, min(score, 100))


def _score_to_level(score: int) -> str:
    if score < 30:
        return "Weak"
    elif score < 55:
        return "Medium"
    elif score < 80:
        return "Strong"
    else:
        return "Very Strong"


def _generate_tips(checks: dict) -> list[str]:
    tips = []
    if not checks["length_ok"]:
        tips.append("Use at least 12 characters for better security")
    elif not checks["length_great"]:
        tips.append("16+ characters makes passwords significantly harder to crack")
    if not checks["has_uppercase"]:
        tips.append("Add uppercase letters (A–Z)")
    if not checks["has_lowercase"]:
        tips.append("Add lowercase letters (a–z)")
    if not checks["has_numbers"]:
        tips.append("Include numbers (0–9)")
    if not checks["has_symbols"]:
        tips.append("Add symbols (!@#$%) for maximum strength")
    if not checks["no_repeats"]:
        tips.append("Avoid repeating characters (e.g. aaa, 111)")
    if not checks["no_sequences"]:
        tips.append("Avoid sequential patterns (e.g. abc, 123, qwerty)")
    if not tips:
        tips.append("Excellent password! Store it in a password manager")
    return tips