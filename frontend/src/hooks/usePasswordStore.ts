import { useState, useCallback, useEffect } from "react";
import type { PasswordHistoryEntry, StrengthResult, GenerateRequest } from "../types";
import { generatePassword, analyzePassword } from "../api/passwordApi";

const HISTORY_KEY = "cipherforge_history";
const MAX_HISTORY = 5;

export function usePasswordStore() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState<StrengthResult | null>(null);
  const [history, setHistory] = useState<PasswordHistoryEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!password) { setStrength(null); return; }
    const timer = setTimeout(async () => {
      try {
        const result = await analyzePassword(password);
        setStrength(result);
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [password]);

  const generate = useCallback(async (req: GenerateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await generatePassword(req);
      setPassword(res.password);
      const analysis = await analyzePassword(res.password);
      setStrength(analysis);
      const entry: PasswordHistoryEntry = {
        password: res.password,
        entropy: res.entropy,
        level: analysis.level,
        timestamp: Date.now(),
      };
      setHistory((prev) => {
        const updated = [entry, ...prev].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return { password, setPassword, strength, history, loading, error, generate, clearHistory };
}