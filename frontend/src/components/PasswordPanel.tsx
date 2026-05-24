import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Copy, Eye, EyeOff, Check, Sliders, Terminal, Lock } from "lucide-react";
import type { GenerateRequest } from "../types";

interface Props {
  password: string;
  loading: boolean;
  error: string | null;
  onGenerate: (req: GenerateRequest) => void;
  onCopy: (pw: string) => void;
  onPasswordChange: (pw: string) => void;
}

interface Toggle {
  key: keyof Pick<GenerateRequest, "uppercase" | "lowercase" | "numbers" | "symbols">;
  label: string;
  sample: string;
}

const TOGGLES: Toggle[] = [
  { key: "uppercase", label: "Uppercase", sample: "A–Z" },
  { key: "lowercase", label: "Lowercase", sample: "a–z" },
  { key: "numbers",   label: "Numbers",   sample: "0–9" },
  { key: "symbols",   label: "Symbols",   sample: "!@#$" },
];

export default function PasswordPanel({ password, loading, error, onGenerate, onCopy, onPasswordChange }: Props) {
  const [config, setConfig] = useState<GenerateRequest>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    passphrase_mode: false,
  });
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => onGenerate(config), [config, onGenerate]);

  const handleCopy = useCallback(() => {
    if (!password) return;
    onCopy(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password, onCopy]);

  const toggleOption = (key: Toggle["key"]) =>
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div
      className="flex flex-col gap-6 rounded-2xl border border-white/10 p-6"
      style={{ background: "rgba(10,10,10,0.65)", backdropFilter: "blur(20px)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(0,255,70,0.1)", border: "1px solid rgba(0,255,70,0.3)" }}
        >
          <Lock size={18} style={{ color: "#00ff46" }} />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white tracking-wide">
            Password Generator
          </h2>
          <p className="text-xs text-gray-500 font-mono">Cryptographically secure</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div
        className="flex rounded-xl overflow-hidden border border-white/10"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        {[
          { label: "Password",   icon: <Sliders size={13} />,  value: false },
          { label: "Passphrase", icon: <Terminal size={13} />, value: true  },
        ].map((m) => (
          <button
            key={String(m.value)}
            onClick={() => setConfig((p) => ({ ...p, passphrase_mode: m.value }))}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono transition-all"
            style={{
              background: config.passphrase_mode === m.value ? "rgba(0,255,70,0.12)" : "transparent",
              color: config.passphrase_mode === m.value ? "#00ff46" : "#555",
              borderBottom: config.passphrase_mode === m.value ? "2px solid #00ff46" : "2px solid transparent",
            }}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Passphrase explanation */}
      {config.passphrase_mode && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono text-gray-600 text-center px-2"
        >
          Generates memorable words like{" "}
          <span style={{ color: "rgba(0,255,70,0.6)" }}>forge-raven-steel-nova</span>
          <br />easier to remember, just as secure
        </motion.div>
      )}

      {/* Password display */}
      <div className="relative">
        <textarea
          rows={1}
          value={visible ? password : (password ? "•".repeat(password.length) : "")}
          onChange={(e) => {
            if (visible) onPasswordChange(e.target.value);
          }}
          placeholder="Click generate..."
          readOnly={!visible}
          className="w-full font-mono text-sm rounded-xl border resize-none"
          style={{
            background: "rgba(0,0,0,0.5)",
            borderColor: password ? "rgba(0,255,70,0.35)" : "rgba(255,255,255,0.08)",
            boxShadow: password ? "0 0 20px rgba(0,255,70,0.08), inset 0 0 12px rgba(0,255,70,0.03)" : "none",
            color: password ? "#e0e0e0" : "#444",
            outline: "none",
            transition: "all 0.3s ease",
            padding: "14px 84px 14px 14px",
            height: "48px",
            lineHeight: "20px",
            overflow: "hidden",
            userSelect: "text",
            WebkitUserSelect: "text",
          }}
        />

        {/* Action buttons — positioned slightly above center */}
        <div
          style={{
            position: "absolute",
            right: "10px",
            top: "0",
            bottom: "4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <button
            onClick={() => setVisible((v) => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: "#555" }}
          >
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={(e) => {
              if (!copied) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              if (!copied) (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: copied ? "rgba(0,255,70,0.2)" : "transparent",
              color: copied ? "#00ff46" : "#555",
              border: copied ? "1px solid rgba(0,255,70,0.4)" : "none",
            }}
          >
            <AnimatePresence mode="wait">
              {copied
                ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={14} /></motion.span>
                : <motion.span key="copy"  initial={{ scale: 0 }} animate={{ scale: 1 }}><Copy size={14} /></motion.span>
              }
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {error && <p className="text-xs font-mono text-red-400 text-center">{error}</p>}

      {/* Length slider */}
      {!config.passphrase_mode && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Length</span>
            <span
              className="text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg"
              style={{ background: "rgba(0,255,70,0.1)", color: "#00ff46" }}
            >
              {config.length}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={config.length}
            onChange={(e) => setConfig((p) => ({ ...p, length: Number(e.target.value) }))}
            className="cipher-slider"
          />
          <div className="flex justify-between text-xs font-mono text-gray-700">
            <span>4</span><span>16</span><span>32</span><span>48</span><span>64</span>
          </div>
        </div>
      )}

      {/* Character toggles */}
      {!config.passphrase_mode && (
        <div className="grid grid-cols-2 gap-2.5">
          {TOGGLES.map((t) => {
            const active = config[t.key];
            return (
              <motion.button
                key={t.key}
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleOption(t.key)}
                className="flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all"
                style={{
                  background: active ? "rgba(0,255,70,0.08)" : "rgba(255,255,255,0.02)",
                  borderColor: active ? "rgba(0,255,70,0.35)" : "rgba(255,255,255,0.07)",
                  boxShadow: active ? "0 0 12px rgba(0,255,70,0.06)" : "none",
                }}
              >
                <div>
                  <p className="text-xs font-mono font-medium" style={{ color: active ? "#fff" : "#555" }}>
                    {t.label}
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: active ? "rgba(0,255,70,0.7)" : "#333" }}>
                    {t.sample}
                  </p>
                </div>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{
                    borderColor: active ? "#00ff46" : "#333",
                    background: active ? "#00ff46" : "transparent",
                    boxShadow: active ? "0 0 8px rgba(0,255,70,0.5)" : "none",
                  }}
                >
                  {active && <Check size={10} style={{ color: "#000" }} strokeWidth={3} />}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Generate button */}
      <motion.button
        onClick={handleGenerate}
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full py-4 rounded-xl font-display font-semibold text-sm tracking-widest uppercase overflow-hidden transition-all"
        style={{
          background: loading ? "rgba(0,255,70,0.05)" : "rgba(0,255,70,0.12)",
          border: "1px solid rgba(0,255,70,0.4)",
          color: "#00ff46",
          boxShadow: loading ? "none" : "0 0 24px rgba(0,255,70,0.2), inset 0 0 24px rgba(0,255,70,0.04)",
          letterSpacing: "0.15em",
        }}
      >
        <span className="flex items-center justify-center gap-2.5">
          <motion.span
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { duration: 0.8, repeat: Infinity, ease: "linear" } : {}}
          >
            <RefreshCw size={16} />
          </motion.span>
          {loading ? "Generating..." : "Generate"}
        </span>
      </motion.button>
    </div>
  );
}