# PromptWars — Challenge 4: Smart Stadiums & Tournament Operations
### 2-Day Execution & Submission Plan (Deadline: 19th July)

---

## 1. Project Concept

**Name idea:** *StadiumGenie* (or *Kickoff Assistant* — pick whichever feels right)

**One-liner:** A GenAI-powered stadium companion that gives fans instant, multilingual answers about navigation, accessibility, and transport, while giving venue staff an AI-assisted operations dashboard for crowd and gate management — built for FIFA World Cup 2026 venues.

Scoping it to two connected pieces keeps it demo-able in 2 days while covering *multiple* challenge tracks (navigation, multilingual, accessibility, crowd management, operational intelligence) instead of just one.

### Core Modules

| Module | What it does | GenAI usage |
|---|---|---|
| **A. Fan Assistant (chat widget)** | Fans ask things like "Where's the nearest accessible gate?", "How do I get to Zone C from Gate 4?", "What time should I leave to catch the last train?" — in any language | LLM call (system prompt with stadium map/data as context) generates natural-language answers; auto-detects/replies in the user's language |
| **B. Ops Dashboard** | Simple staff-facing view: mock gate/zone occupancy numbers + an AI-generated recommendation feed ("Gate 3 nearing capacity — redirect fans to Gate 5", "Rain expected 6pm — activate covered walkway signage") | LLM summarizes structured mock data into human-readable operational recommendations in real time |

### Tech Stack (matches what you already know — fastest path to a working demo)

- **Frontend/Full-stack:** Next.js 15 (App Router)
- **Backend/DB:** Supabase (store mock stadium data: gates, zones, occupancy, transport options, FAQs)
- **GenAI:** Gemini API or OpenAI API (free-tier key) called from a Next.js API route — never call the LLM directly from the client
- **Deploy:** Vercel (free, fast, gives you a live demo link — many judges value a live link over just a repo)
- **Repo:** Single branch, keep node_modules/.next out via .gitignore to stay under 10MB

---

## 2. Phase-Wise Plan (48 hours)

### 🟦 Phase 1 — Setup & Data (Today, ~3–4 hrs)
- [ ] Create new **public** GitHub repo, single default branch (`main`)
- [ ] `npx create-next-app` → push initial commit immediately (get repo link locked in early)
- [ ] Set up Supabase project; create tables: `gates`, `zones`, `transport_options`, `faqs` (seed with realistic mock World Cup stadium data — 6–8 gates, 4–5 zones is enough)
- [ ] Get an LLM API key (Gemini or OpenAI), add to `.env.local`, confirm `.env*` is in `.gitignore`
- [ ] Write the system prompt / context payload that will be injected into every LLM call (stadium layout, FAQs, transport data as structured text)

### 🟩 Phase 2 — Fan Assistant Module (Today/Tonight, ~4–5 hrs)
- [ ] Build chat UI (simple message list + input, no need for anything fancy — clarity beats polish here)
- [ ] API route `/api/assistant`: takes user message → injects stadium context + conversation → calls LLM → returns answer
- [ ] Add multilingual behavior: instruct the model in the system prompt to detect input language and reply in the same language
- [ ] Test 5–6 realistic queries (navigation, accessibility, transport, multilingual) and tune the prompt until answers are accurate and grounded in your mock data (avoid hallucinated gate numbers)

### 🟨 Phase 3 — Ops Dashboard Module (Day 2 morning, ~3–4 hrs)
- [ ] Build a simple dashboard page: cards/table showing each gate/zone with a mock live occupancy % (can be randomized or slowly incrementing for demo effect)
- [ ] API route `/api/insights`: sends current occupancy snapshot to the LLM → returns 2–4 short, prioritized action recommendations
- [ ] Auto-refresh insights every X seconds or on a "Refresh AI Insights" button (simpler and more demo-safe than true real-time)

### 🟧 Phase 4 — Polish, Video/Docs, Deploy (Day 2 afternoon, ~3 hrs)
- [ ] Basic UI cleanup: consistent spacing, a clear landing/header explaining the challenge + solution in one line
- [ ] Add a short **README.md**: problem statement, solution summary, tech stack, setup instructions, screenshots
- [ ] Deploy to Vercel, confirm live link works end-to-end (fresh incognito test)
- [ ] Record a 2–3 min demo video if the platform requests/allows one (show both modules working)
- [ ] Final repo check: public ✅, single branch ✅, size < 10MB ✅ (`du -sh .git` locally, and make sure `node_modules`/`.next` were never committed)

### 🟥 Phase 5 — Submission (Day 2 evening — buffer before deadline)
- [ ] Push final commit to GitHub
- [ ] Copy the public repo URL
- [ ] Log in to the Hack2skill portal → Prompt Wars Dashboard → Submissions tab
- [ ] Fill submission fields (repo link, live demo link if there's a field for it, description)
- [ ] Submit **early enough to use a 2nd attempt if something's wrong** — you get 3 attempts, don't burn them all right at the deadline
- [ ] Double check after submitting: repo still public, still single branch (a stray branch from a merge can sneak in)

---

## 3. Time Buffer Strategy
Since you only have 3 submission attempts and 2 days:
- Do a **rough first submission by end of Day 1 night** even if incomplete — this confirms the process works and the repo/link is valid, leaving your 2nd and 3rd attempts as safety nets for the improved version.
- Don't let Phase 4 polish creep into Phase 5's time — an ugly-but-working demo beats a polished-but-broken one.

---

## 4. Quick Risk Checklist
- **Repo size** — never commit `node_modules`, `.next`, `.env` files
- **Single branch** — if you branch to experiment, merge and delete the branch before pushing
- **API key exposure** — LLM calls must go through a server-side API route, never from client-side code
- **Hallucination risk** — always ground answers in your seeded Supabase data via the prompt context, don't let the model invent gate numbers or times
