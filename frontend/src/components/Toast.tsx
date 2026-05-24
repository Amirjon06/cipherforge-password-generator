import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, type = "success", visible, onHide }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2500);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(16px)",
            borderColor: type === "success" ? "rgba(0,255,70,0.4)" : "rgba(255,70,70,0.4)",
            boxShadow: type === "success"
              ? "0 0 24px rgba(0,255,70,0.25), 0 4px 20px rgba(0,0,0,0.5)"
              : "0 0 24px rgba(255,70,70,0.25), 0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {type === "success"
            ? <CheckCircle size={18} style={{ color: "#00ff46" }} />
            : <AlertCircle size={18} style={{ color: "#ff4646" }} />
          }
          <span className="text-sm font-mono font-medium text-white">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}