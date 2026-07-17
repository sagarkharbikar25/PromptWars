# StadiumGenie 🏟️🧞
**Challenge 4: Smart Stadiums & Tournament Operations**  
*A GenAI-powered stadium companion & operations dashboard built for FIFA World Cup 2026.*

StadiumGenie bridges the gap between fans and stadium operators by providing a dual-interface experience. It features a fan-facing, multilingual accessibility chatbot and a venue staff operations dashboard that translates real-time gate telemetry into actionable intelligence using Gemini AI.

---

## 🚀 Key Modules & Features

### 💬 1. Fan Chat Assistant
* **Context-Grounded Answers:** Uses a rich stadium map, transit, and policy database to ensure answers about accessible gates, sensory rooms, and bag policies are accurate and hallucination-free.
* **Automatic Multilingual Support:** Detects the input language automatically (English, Spanish, French, Hindi, German, Arabic, etc.) and translates all replies dynamically.
* **Accessibility Priority:** Automatically highlights zero-step entrances (like **Gate 3 East Accessible**) and sensory-escape spaces (like the **Sensory Room in Zone B**) when accessibility keywords are triggered.

### 📊 2. Staff Operations Dashboard
* **Telemetry Monitoring:** Live tracking of gate capacity, zone crowd levels, security status, and transit wait times.
* **Interactive Telemetry Modifiers:** Staff (and judges!) can click on any gate card, adjust its capacity slider, and apply changes.
* **GenAI Recommendation Engine:** Analyzes live gate occupancy and transit delays to output 3 high-priority, tactical instructions for ground crews (e.g. redirecting crowds to empty gates, deploying security, or recommending alternative transit).

---

## 🛠️ Tech Stack
* **Framework:** Next.js 15 (App Router, React 19)
* **Language:** TypeScript
* **Styling:** Premium Custom CSS (Midnight dark theme, Glassmorphic overlays, ambient glow backgrounds, responsive layout grids, hover animations)
* **GenAI:** Gemini API (`gemini-2.5-flash` model via Server-Side API routes)
* **Version Control:** Git (Single-branch setup for Hackathon guidelines)

---

## ⚙️ Quick Start (Windows Setup)

### 1. Configure Keys
Duplicate the `.env.example` file and rename it to `.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key
```
*(Note: If left blank or unconfigured, the app falls back gracefully to a smart demo simulator, allowing judges to click and test the app immediately out-of-the-box!)*

### 2. Install & Run Locally
Double-click the helper script **`run_app.bat`** (or execute the commands below in your terminal):
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

### 3. Connect & Push to Git
Double-click the helper script **`setup_git.bat`** (or execute the commands below in your terminal) to connect the repository and push to GitHub:
```bash
git init
git remote add origin https://github.com/sagarkharbikar25/PromptWars.git
git branch -M main
git add .
git commit -m "Initialize StadiumGenie App - Fan Assistant & Ops Dashboard"
git push -u origin main
```

---

## 📄 File Architecture
* `app/page.tsx` — Main page (Tabs for Fan Assistant and Ops Control Room)
* `app/globals.css` — Core style design system (gradients, animations, grid columns)
* `app/api/assistant/route.ts` — Server route querying Gemini for fan queries
* `app/api/insights/route.ts` — Server route querying Gemini to analyze telemetry data
* `lib/stadiumData.ts` — Structured mock dataset (gates, transport, FAQs)
* `lib/supabase.ts` — Supabase configuration client with local memory fallback
