export interface GenerateRequest {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  passphrase_mode: boolean;
}

export interface GenerateResponse {
  password: string;
  entropy: number;
}

export interface StrengthChecks {
  length_ok: boolean;
  length_great: boolean;
  has_uppercase: boolean;
  has_lowercase: boolean;
  has_numbers: boolean;
  has_symbols: boolean;
  no_repeats: boolean;
  no_sequences: boolean;
  length: number;
}

export interface StrengthResult {
  score: number;
  level: "Weak" | "Medium" | "Strong" | "Very Strong";
  entropy: number;
  checks: StrengthChecks;
  tips: string[];
}

export interface PasswordHistoryEntry {
  password: string;
  entropy: number;
  level: string;
  timestamp: number;
}