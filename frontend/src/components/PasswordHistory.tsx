import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, Copy } from "lucide-react";
import type { PasswordHistoryEntry } from "../types";

interface Props {
  history: PasswordHistoryEntry[];
  onCopy: (pw: string) => void;
  onClear: () => void;
}

const LEVEL_COLORS: Record<string, string> = {
  Weak: "#ff4646",
  Medium: "#ffa500",
  Strong: "#00c8ff",
  "Very Strong": "#00ff46",
};

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

export default function PasswordHistory({ history, onCopy, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mt-6 rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: "rgba(10,10,10,0.6)", backdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock size={14} style={{ color: "#00ff46" }} />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            Recent Passwords
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={12} />
          Clear
        </button>
      </div>

      <div className="divide-y divide-white/5">
        <AnimatePresence initial={false}>
          {history.map((entry, i) => (
            <motion.div
              key={entry.timestamp}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 px-5 py-2.5 group hover:bg-white/5 transition-colors"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: LEVEL_COLORS[entry.level] ?? "#fff",
                  boxShadow: `0 0 6px ${LEVEL_COLORS[entry.level] ?? "#fff"}`,
                }}
              />
              <span className="flex-1 font-mono text-xs text-gray-300 truncate tracking-wider">
                {entry.password}
              </span>
              <div className="flex items-center gap-3 shrink-0 ml-auto">
                <span className="text-xs font-mono text-gray-600 whitespace-nowrap">
                  {entry.entropy.toFixed(0)}b · {formatTime(entry.timestamp)}
                </span>
                <button
                  onClick={() => onCopy(entry.password)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white"
                >
                  <Copy size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}