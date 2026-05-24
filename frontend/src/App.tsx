import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import MatrixBackground from "./components/MatrixBackground";
import PasswordPanel from "./components/PasswordPanel";
import StrengthPanel from "./components/StrengthPanel";
import PasswordHistory from "./components/PasswordHistory";
import Toast from "./components/Toast";
import CursorEffect from "./components/CursorEffect";
import RobotScene from "./components/RobotScene";
import { usePasswordStore } from "./hooks/usePasswordStore";

export default function App() {
  const { password, setPassword, strength, history, loading, error, generate, clearHistory } =
    usePasswordStore();

  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as const });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message, type: "success" });
  }, []);

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, visible: false }));
  }, []);

  const handleCopy = useCallback((pw: string) => {
    navigator.clipboard.writeText(pw).then(() => showToast("Password copied to clipboard"));
  }, [showToast]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <CursorEffect />
      <MatrixBackground />

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,255,70,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between px-6 py-5 border-b border-white/5"
          style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.4)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm"
              style={{
                background: "rgba(0,255,70,0.15)",
                border: "1px solid rgba(0,255,70,0.4)",
                color: "#00ff46",
                boxShadow: "0 0 16px rgba(0,255,70,0.2)",
              }}
            >
              CF
            </div>
            <span
              className="font-display font-bold text-base tracking-[0.12em] uppercase"
              style={{ color: "#00ff46", textShadow: "0 0 20px rgba(0,255,70,0.5)" }}
            >
              CipherForge
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#00ff46", boxShadow: "0 0 8px #00ff46" }}
            />
            <span className="text-xs font-mono text-gray-500">ONLINE</span>
          </div>
        </motion.header>

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-10 gap-6 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-center space-y-2 mb-2"
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Forge Your{" "}
              <span style={{ color: "#00ff46", textShadow: "0 0 30px rgba(0,255,70,0.5)" }}>
                Digital Shield
              </span>
            </h1>
            <p className="text-sm font-mono text-gray-500 max-w-md mx-auto">
              Cryptographically secure passwords with real-time strength analysis
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-4"
            data-nofx
          >
            <PasswordPanel
              password={password}
              loading={loading}
              error={error}
              onGenerate={generate}
              onCopy={handleCopy}
              onPasswordChange={setPassword}
            />
            <StrengthPanel strength={strength} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="rounded-2xl border border-white/10 overflow-hidden flex flex-col"
              style={{
                background: "rgba(10,10,10,0.65)",
                backdropFilter: "blur(20px)",
                minHeight: "480px",
              }}
              data-nofx
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "#00ff46", boxShadow: "0 0 6px #00ff46" }}
                  />
                  <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">
                    CipherBot
                  </span>
                </div>
                <span className="text-xs font-mono text-gray-700">
                  drag · click
                </span>
              </div>

              <div className="flex-1 w-full" style={{paddingBottom: "60px"}}>
                <RobotScene />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full"
            data-nofx
          >
            <PasswordHistory
              history={history}
              onCopy={handleCopy}
              onClear={clearHistory}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs font-mono text-gray-700 text-center mt-4">
              Passwords are generated locally and never stored on our servers
            </p>
          </motion.div>
        </main>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </div>
  );
}