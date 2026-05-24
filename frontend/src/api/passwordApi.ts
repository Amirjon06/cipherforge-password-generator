import type { GenerateRequest, GenerateResponse, StrengthResult } from "../types";

const BASE = "http://localhost:8000/api/password";

export async function generatePassword(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch(`${BASE}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Failed to generate password");
  }
  return res.json();
}

export async function analyzePassword(password: string): Promise<StrengthResult> {
  const res = await fetch(`${BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Failed to analyze password");
  return res.json();
}