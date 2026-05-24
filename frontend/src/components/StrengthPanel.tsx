import { motion } from "framer-motion";
import { Shield, Zap, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import type { StrengthResult } from "../types";

interface Props {
  strength: StrengthResult | null;
}

const LEVEL_CONFIG = {
  Weak:          { color: "#ff4646", glow: "rgba(255,70,70,0.4)",   segments: 1 },
  Medium:        { color: "#ffa500", glow: "rgba(255,165,0,0.4)",   segments: 2 },
  Strong:        { color: "#00c8ff", glow: "rgba(0,200,255,0.4)",   segments: 3 },
  "Very Strong": { color: "#00ff46", glow: "rgba(0,255,70,0.4)",    segments: 4 },
};

const CHECK_LABELS: Record<string, string> = {
  length_ok:     "12+ characters",
  length_great:  "16+ characters",
  has_uppercase: "Uppercase (A–Z)",
  has_lowercase: "Lowercase (a–z)",
  has_numbers:   "Numbers (0–9)",
  has_symbols:   "Symbols (!@#$%)",
  no_repeats:    "No repeated chars",
  no_sequences:  "No sequences",
};

export default function StrengthPanel({ strength }: Props) {
  const cfg = strength ? LEVEL_CONFIG[strength.level] ?? LEVEL_CONFIG["Weak"] : null;

  return (
    <div
      className="flex flex-col gap-5 rounded-2xl border border-white/10 p-6 h-full"
      style={{ background: "rgba(10,10,10,0.65)", backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(0,255,70,0.1)", border: "1px solid rgba(0,255,70,0.3)" }}
        >
          <Shield size={18} style={{ color: "#00ff46" }} />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white tracking-wide">
            Strength Analysis
          </h2>
          <p className="text-xs text-gray-500 font-mono">Real-time evaluation</p>
        </div>
      </div>

      {!strength ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 font-mono text-sm text-center">
            Generate a password<br />to see analysis
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <motion.span
              key={strength.level}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-display font-bold"
              style={{ color: cfg!.color, textShadow: `0 0 20px ${cfg!.glow}` }}
            >
              {strength.level}
            </motion.span>
            <span className="font-mono text-3xl font-bold text-white">
              {strength.score}
              <span className="text-sm text-gray-500">/100</span>
            </span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((seg) => {
              const lit = strength.score > 0 && seg <= cfg!.segments;
              return (
                <motion.div
                  key={seg}
                  className="h-2.5 flex-1 rounded-full"
                  style={{
                    background: lit ? cfg!.color : "rgba(255,255,255,0.07)",
                    boxShadow: lit ? `0 0 8px ${cfg!.glow}` : "none",
                  }}
                  transition={{ delay: seg * 0.08, type: "spring", stiffness: 300 }}
                />
              );
            })}
          </div>

          <div
            className="flex items-center justify-between rounded-xl px-4 py-3 border border-white/5"
            style={{ background: "rgba(0,255,70,0.04)" }}
          >
            <div className="flex items-center gap-2">
              <Zap size={15} style={{ color: "#00ff46" }} />
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Entropy</span>
            </div>
            <motion.span
              key={strength.entropy}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono font-bold text-sm"
              style={{ color: "#00ff46" }}
            >
              {strength.entropy.toFixed(1)} bits
            </motion.span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-3">
              Security Checks
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.entries(strength.checks)
                .filter(([key]) => key !== "length")
                .map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2.5">
                    {val ? (
                      <CheckCircle size={13} style={{ color: "#00ff46", flexShrink: 0 }} />
                    ) : (
                      <XCircle size={13} style={{ color: "#555", flexShrink: 0 }} />
                    )}
                    <span
                      className="text-xs font-mono"
                      style={{ color: val ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}
                    >
                      {CHECK_LABELS[key] ?? key}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {strength.tips.length > 0 && (
            <div
              className="rounded-xl p-4 border border-white/5 space-y-2"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={13} style={{ color: "#ffa500" }} />
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  Security Tips
                </span>
              </div>
              {strength.tips.map((tip, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-xs font-mono text-gray-400 leading-relaxed pl-3 border-l border-yellow-500/30"
                >
                  {tip}
                </motion.p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}