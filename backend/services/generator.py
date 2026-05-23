import secrets
import string
import math
import random

WORDLIST = [
    "anchor", "beacon", "cipher", "delta", "ember", "falcon", "ghost",
    "harbor", "iron", "jade", "knight", "lance", "marble", "nebula",
    "orbit", "phantom", "quartz", "raven", "steel", "titan", "ultra",
    "vault", "wolf", "xenon", "yield", "zenith", "arrow", "blaze",
    "cobra", "dagger", "eagle", "frost", "glacier", "hammer", "inferno",
    "jungle", "karma", "laser", "matrix", "nova", "ozone", "prism",
    "radar", "shadow", "thorn", "unity", "viper", "storm", "pixel",
    "forge", "creed", "neon", "spark", "shift", "blade", "pulse",
]


def build_charset(uppercase: bool, lowercase: bool, numbers: bool, symbols: bool) -> str:
    charset = ""
    if uppercase:
        charset += string.ascii_uppercase
    if lowercase:
        charset += string.ascii_lowercase
    if numbers:
        charset += string.digits
    if symbols:
        charset += string.punctuation
    return charset or string.ascii_letters


def calculate_entropy(password: str) -> tuple[float, int]:
    charset_size = 0
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_symbol = any(c in string.punctuation for c in password)

    if has_upper:
        charset_size += 26
    if has_lower:
        charset_size += 26
    if has_digit:
        charset_size += 10
    if has_symbol:
        charset_size += 32

    charset_size = max(charset_size, 26)
    entropy = len(password) * math.log2(charset_size)
    return round(entropy, 2), charset_size


def generate_password(
    length: int,
    uppercase: bool,
    lowercase: bool,
    numbers: bool,
    symbols: bool,
) -> tuple[str, float]:
    charset = build_charset(uppercase, lowercase, numbers, symbols)

    # Guarantee at least one char from each enabled category
    required = []
    if uppercase:
        required.append(secrets.choice(string.ascii_uppercase))
    if lowercase:
        required.append(secrets.choice(string.ascii_lowercase))
    if numbers:
        required.append(secrets.choice(string.digits))
    if symbols:
        required.append(secrets.choice(string.punctuation))

    remaining = length - len(required)
    if remaining < 0:
        remaining = 0

    password_chars = required + [secrets.choice(charset) for _ in range(remaining)]
    secrets.SystemRandom().shuffle(password_chars)
    password = "".join(password_chars[:length])

    entropy, _ = calculate_entropy(password)
    return password, entropy


def generate_passphrase(word_count: int = 4) -> tuple[str, float]:
    words = [secrets.choice(WORDLIST) for _ in range(word_count)]
    passphrase = "-".join(words)
    entropy, _ = calculate_entropy(passphrase)
    return passphrase, entropy