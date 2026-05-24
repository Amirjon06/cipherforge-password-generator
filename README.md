# CipherForge 🔐

A cyberpunk-themed password generator built as a portfolio project. It generates cryptographically secure passwords, analyzes their strength in real time, and looks good doing it.

---

## What it does

- Generates random secure passwords using Python's `secrets` module on the backend — not `Math.random()`, which is not cryptographically safe
- Lets you control password length, character types (uppercase, lowercase, numbers, symbols), and switch between regular password mode and passphrase mode
- Passphrase mode generates something like `forge-raven-steel-nova` — easier to remember, just as secure
- Analyzes the strength of any password you type or generate — checks length, character variety, repeated characters, sequential patterns, and gives it a score out of 100
- Shows entropy in bits so you understand how mathematically strong the password actually is
- Saves your last 5 generated passwords locally in your browser
- Lets you copy any password with one click

---

## What it looks like

The whole app runs on a dark black background with neon green accents and a Matrix-style rain animation in the background. The panels use a glassmorphism effect — semi-transparent with a blur behind them.

When you move your mouse around the page, neon green particles trail behind your cursor. They react to how fast you move — slow movement = fewer particles, fast movement = more sparks.

On the right side there's a 3D robot called CipherBot. He floats up and down on idle, his head tracks wherever your cursor is, you can drag to rotate him, and if you click him he bounces. When you let go he slowly returns to his original position.

---

## Screenshots

![Main View](PASTE_LINK_HERE)
![Password Generated](PASTE_LINK_HERE)
![Passphrase Mode](PASTE_LINK_HERE)

---

## Tech stack

**Frontend**
- React + TypeScript
- Vite
- TailwindCSS v4
- Framer Motion — all animations and transitions
- Three.js — the 3D robot rendering and interaction
- Lucide React — icons

**Backend**
- Python
- FastAPI
- Uvicorn

---

## How to run it locally

You need Python 3.10+ and Node.js installed.

**Backend**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn
python3 -m uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser. Keep both terminals running at the same time.

---

## Project structure
```
cipherforge-password-generator/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── models/schemas.py        # Request/response types
│   ├── routers/password.py      # API routes
│   └── services/
│       ├── generator.py         # Password generation logic
│       └── analyzer.py          # Strength analysis logic
└── frontend/
└── src/
├── App.tsx
├── api/passwordApi.ts   # Backend communication
├── components/
│   ├── MatrixBackground.tsx
│   ├── PasswordPanel.tsx
│   ├── StrengthPanel.tsx
│   ├── PasswordHistory.tsx
│   ├── RobotScene.tsx
│   ├── CursorEffect.tsx
│   └── Toast.tsx
├── hooks/usePasswordStore.ts
└── types/index.ts

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/password/generate` | Generate a password or passphrase |
| POST | `/api/password/analyze` | Analyze password strength |
| POST | `/api/password/entropy` | Calculate entropy score |
| GET | `/health` | Check if backend is running |

---

## Notes

- The 3D robot model (CipherBot) is the Mini Robot by YarikLegendary, licensed under Creative Commons Attribution. Credit to the original creator.
- Passwords are generated on the backend and never logged or stored anywhere on a server.
- Password history is saved only in your browser's localStorage and never leaves your device.

---

## License

MIT — use it, learn from it, build on it.
