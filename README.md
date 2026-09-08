# LokDrishti AI — Evidence-Grounded Location Intelligence

<div align="center">

![LokDrishti](https://img.shields.io/badge/LokDrishti-AI%20Agent-amber?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Gemini](https://img.shields.io/badge/Gemini-Structured%20Output-orange?style=for-the-badge&logo=google)
![Parallel](https://img.shields.io/badge/Parallel-Live%20Search-teal?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Turn any film scene into ranked, evidence-backed Indian shooting locations — live permit research via Gemini + Parallel Search, never hallucinated.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Scoring Model](#-scoring-model)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Known Issues & Limitations](#-known-issues--limitations)
- [Roadmap](#-roadmap)
- [Hackathon Compliance](#-hackathon-compliance)

---

## 🎬 Overview

**LokDrishti AI** is an agentic pre-production intelligence tool for Indian film production. A line producer or location manager must answer two different questions before a shoot:

1. Does a real location visually fit the scene?
2. Can the crew plausibly shoot there under current permit, access, heritage, and operational conditions?

LokDrishti answers both. Paste a scene description and the agent pipeline returns up to three grounded Indian location candidates, each with a transparent 0–100 feasibility score, source-backed permit evidence, coverage gaps, and risk warnings. Missing evidence never means permission is granted — the system degrades to conservative `HIGH_RISK` states with explicit gaps instead of inventing permits.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **Scene Intelligence** | Gemini extracts visual + operational requirements (setting, time-of-day, crowd, night/heritage/drone/stunt flags) as structured JSON |
| 📍 **Grounded Discovery** | Parallel Search API finds up to three real Indian candidates; zero-source candidates are filtered out automatically |
| 🔍 **Adaptive Research** | Production Intelligence selects research dimensions per scene — ASI/heritage, night-shoot NOCs, drone/airspace, police + road-closure for stunts |
| ⚖️ **Deterministic Scoring** | Authority × evidence-state weighted score computed in code (visual 30 / permit 30 / access 20 / risk 20) |
| 🛡️ **Recommendation Gating** | Critical dimensions with no meaningful evidence cap status at `FEASIBLE_WITH_CONDITIONS` with a `Best available` marker — never `RECOMMENDED` on gaps |
| 📡 **Live Research Trail** | SSE-streamed execution events: every Parallel query, source, and agent decision visible in real time |
| 🃏 **Verdict Cards** | Score breakdown, evidence states, official-source counts, coverage gaps, risk warnings, clickable citations |
| 🚫 **Injection Defense** | Scene text treated strictly as data; instruction-pattern sanitization on search keywords (live-tested) |
| 🧯 **Graceful Degradation** | Per-candidate fault isolation (`Promise.allSettled`); quota/overload failures become gapped low-score reports, never crashes or invented permits |
| 🎨 **Cinematic UI** | 3D-tilt cards, count-up scores, staggered entrances, live-trail pulse — pure CSS, no new dependencies |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                            │
│                                                                  │
│  ┌──────────────┐   ┌──────────────────┐   ┌───────────────────┐ │
│  │ SceneInput   │──▶│ AgentTimeline    │──▶│ LocationCard ×3 + │ │
│  │ (brief +     │   │ (SSE live trail) │   │ ComparisonMatrix  │ │
│  │  examples)   │   │                  │   │ (verdicts + gaps) │ │
│  └──────────────┘   └──────────────────┘   └───────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │ POST /api/analyze (SSE)                              ▲
           ▼                                                      │ events
┌─────────────────────────────────────────────────────────────────┐
│                    runOrchestrator (server)                      │
│                                                                  │
│  Scene Intelligence ──▶ Location Discovery ──▶ Production Intel  │
│   (Gemini parse)        (Parallel search      (Parallel ×3,      │
│                          + Gemini select)      concurrent +       │
│                                                Gemini extract)   │
│                              │                                   │
│                              ▼                                   │
│                    Evidence & Ranking (pure code:                │
│                    authority → state → weights → gating)         │
└─────────────────────────────────────────────────────────────────┘
           │                              │
           ▼                              ▼
┌──────────────────┐           ┌──────────────────────┐
│  Gemini          │           │  Parallel Search API │
│  (@google/genai, │           │  POST .../v1/search  │
│  structured JSON)│           │  objective + queries │
└──────────────────┘           └──────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 (App Router) + TypeScript | React web application |
| **Styling** | Tailwind CSS + custom cinematic system | Dark production-tool UI, 3D tilt, staggered motion |
| **LLM** | Google Gemini via `@google/genai` (structured JSON output) | Scene parsing, candidate selection, evidence extraction |
| **Live evidence** | Parallel Search API at runtime | Sole external-evidence source (discovery + per-candidate research) |
| **Streaming** | Server-Sent Events (`/api/analyze`) | Live agent trail, queries, sources, verdicts |
| **Scoring** | Pure TypeScript (`scorer.ts`, `evidence.ts`) | Authority classification, evidence states, weights, gating |
| **Icons** | lucide-react | UI iconography |
| **Deploy** | Dockerfile (standalone) / Vercel Pro | Cloud Run primary target |

---

## 📁 Project Structure

```
LokDrishti-AI/
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts   # POST — SSE orchestrator endpoint (GET = readiness)
│   │   ├── globals.css            # Cinematic depth/motion system
│   │   ├── layout.tsx             # Fonts, metadata, film-grain, footer
│   │   ├── not-found.tsx          # Branded 404
│   │   └── page.tsx               # Client: SSE consumer, state, results sections
│   ├── agents/
│   │   ├── scene-parser.ts            # Gemini → SceneSpec (+ injection sanitization)
│   │   ├── location-discovery.ts      # Parallel search → ≤3 grounded candidates
│   │   └── production-intelligence.ts # Per-candidate Parallel research → evidence
│   ├── lib/
│   │   ├── orchestrator.ts    # 4-stage pipeline, SSE event emission
│   │   ├── google-gemini.ts   # SDK client (+ GEMINI_MODEL override)
│   │   ├── parallel-search.ts # Search API client (timeout, retry, 429 backoff)
│   │   ├── evidence.ts        # Authority classification + evidence states (code)
│   │   ├── scorer.ts          # Weights + critical-dimension gating (code)
│   │   ├── schemas.ts         # Types + Gemini JSON schemas
│   │   └── utils.ts           # Score/state formatting
│   ├── components/
│   │   ├── SceneInput.tsx        # Brief editor + examples + cancel
│   │   ├── AgentTimeline.tsx     # Live research trail
│   │   ├── LocationCard.tsx      # Verdict card (score, evidence, gaps)
│   │   ├── ComparisonMatrix.tsx  # Score breakdown table
│   │   ├── ErrorBoundary.tsx     # Section-level crash isolation
│   │   ├── Tilt.tsx / CountUp.tsx# 3D tilt + animated scores
│   │   └── DisclaimerBanner.tsx  # Legal notice
├── scripts/score-test.mjs     # Deterministic scoring contract test
├── Dockerfile                 # Cloud Run image (standalone build)
├── next.config.mjs            # output: standalone
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+
- **npm** v9+
- A **Google Gen AI** API key (Gemini)
- A **Parallel** Search API key → [platform.parallel.ai](https://platform.parallel.ai)

### 1. Clone & Install

```bash
git clone https://github.com/adhipatya3552/LokDrishti-AI.git
cd LokDrishti-AI
npm install
```

### 2. Configure Environment

```bash
copy .env.example .env.local
```

Set these server-only variables in `.env.local` (see [Environment Variables](#-environment-variables)).

### 3. Start Development Server

```bash
npm run dev
```

App runs at → **http://localhost:3000**

### 4. Try a Demo Scene

Paste into the scene box and hit **Scout & analyze** (~20–65s):

> A high-energy night chase through a crowded heritage bazaar with Mughal-era havelis, narrow galis, spice shops and festival crowds. The hero flees across rooftops and through the market as 150 extras scatter. Need night-shoot permission, heritage-area clearance, rooftop access and crowd control.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | ✅ Yes | Google Gen AI key (server-only, never exposed to browser) |
| `PARALLEL_API_KEY` | ✅ Yes | Parallel Search API key (server-only) |
| `PARALLEL_API_URL` | Optional | Override endpoint (default `https://api.parallel.ai/v1/search`) |
| `GEMINI_MODEL` | Optional | Override model (default `gemini-2.5-flash`; e.g. `gemini-2.5-flash-lite`) |

> Keys stay server-side in `src/lib/*` and the API route. Client bundle verified free of key material. Never commit `.env.local` (gitignored).

---

## ⚙️ How It Works

### Step 1 — Scene Intelligence
Gemini parses the brief into a `SceneSpec`: setting type, time-of-day, crowd density, and flags (`night_shoot`, `heritage_risk`, `water_elements`, `stunt_pyrotechnics`, `drone_required`, `heavy_vehicles`). Instruction-like patterns are stripped from derived keywords.

### Step 2 — Location Discovery
Scene-derived queries hit Parallel Search (1 batched call). Gemini selects up to 3 candidates **only from returned results**; candidates with zero grounding sources are dropped (empty state shown if all drop).

### Step 3 — Production Intelligence
Per candidate (concurrent), the agent picks research dimensions from the spec — heritage→ASI queries, night→night-NOC, drone→airspace, stunt/pyro→police + road-closure — then calls Parallel Search and extracts URL-matched, source-backed evidence items. Application code (not the LLM) computes source authority and evidence state.

### Step 4 — Evidence & Ranking
Deterministic scoring, critical-dimension gating, and ranking. Reports stream back over SSE with full traces.

---

## 📊 Scoring Model

The score is deterministic and intentionally **not** a legal probability:

| Dimension | Max | How it's earned |
|-----------|-----|-----------------|
| Visual match | 30 | Reasoning depth + discovery-source count |
| Permit evidence | 30 | Authority × evidence-state weighted average over permit categories |
| Access / logistics | 20 | Same weighting over access/logistics evidence (2 pts floor when absent) |
| Risk profile | 20 | Starts full; prohibitions, restrictions, conflicts, and missing critical evidence deduct |

`RECOMMENDED` (≥72, no blocking evidence) is additionally gated: any scene-required dimension (night/heritage/drone) without VERIFIED/SUPPORTED evidence caps the status at `FEASIBLE_WITH_CONDITIONS` with a `Best available` marker.

---

## 📡 API Reference

### `POST /api/analyze`
Runs the full pipeline; streams Server-Sent Events.

**Request:**
```json
{ "sceneText": "A night chase through a heritage bazaar..." }
```

**Events:** `agent_start` → `agent_end` (Scene Intelligence) → `parallel_query` / `parallel_result` (Location Discovery) → `parallel_query` / `parallel_result` (Production Intelligence) → `agent_end` (Evidence & Ranking) → `final_result`. `error` / `warning` events on validation or degradation.

**Validation:** empty → error event; >5000 chars → error event (HTTP stays 200 by SSE design).

### `GET /api/analyze`
Readiness probe. **Response:** `{"status":"ready","service":"LokDrishti AI"}`

---

## 🧪 Testing

```bash
npm test          # deterministic scoring contract
npm run build     # production build + typecheck
```

**Live verification (measured, real APIs):** 11-run adversarial matrix + 12-run demo matrix across 3 Gemini models — injection PASS, no-evidence PASS, graceful 429/503 degradation, 4/4 reliability on the demo scenario, zero hallucinated permits. See `FINAL_RELEASE_AUDIT.md`, `DEMO_EVALUATION.md`.

---

## 🌐 Deployment

### Primary: Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT/lokdrishti
gcloud run deploy lokdrishti --image gcr.io/PROJECT/lokdrishti --set-secrets GOOGLE_API_KEY=...,PARALLEL_API_KEY=...
```

`Dockerfile` + `output: 'standalone'` included; SSE runs exceed Hobby-platform timeouts, hence Cloud Run (or Vercel Pro with `maxDuration: 300` — never Hobby).

Set `GOOGLE_API_KEY` / `PARALLEL_API_KEY` as secret env vars in the host dashboard.

---

## ⚠️ Known Issues & Limitations

| Issue | Status | Note |
|-------|--------|------|
| Gemini free-tier quota (20 req/day/model; ~5 calls/run) | Active | Enable billing before judged demos; pace runs ≥60s apart |
| End-to-end latency 16–140s (median ~60s) | By design | Production Intelligence dominates; narrated live trail covers the wait |
| Discovery granularity for non-heritage scenes | Improved | Specificity prompts + zero-source filter; listicle grounding still possible |
| No live conflict detector feeding `contradictionCount` | Open (P2) | Conflict state machine + penalties unit-verified; auto-detection not yet wired |
| RECOMMENDED label lenient vs gaps | Mitigated | Gaps always surfaced; critical-dimension gating caps status |

LokDrishti is a research assistant, not a legal authority, permit issuer, or guarantee of shootability. Final permissions, fees, safety approvals, road closures, and access conditions must be confirmed with the relevant authority and on-site production professionals.

---

## 🗺️ Roadmap

- [x] 3-agent evidence-grounded pipeline with live Parallel Search
- [x] Deterministic scoring + critical-dimension gating
- [x] Prompt-injection defense (live-tested)
- [x] Failure-path UX (cancel, boundaries, empty states)
- [x] Cinematic depth UI (tilt, count-up, staggered motion)
- [ ] Cloud Run production deployment + public URL
- [ ] Deeper state film-policy coverage (more single-window systems)
- [ ] Live conflict auto-detection across sources
- [ ] Feedback from working line producers

---

## 🏆 Hackathon Compliance

New implementation built during the contest period for the **Parallel track** of the Agentic Cinema Hackathon. Uses Google Gemini via the accepted `@google/genai` package and the Parallel Search API at runtime on every user run (direct HTTPS integration in `src/lib/parallel-search.ts`, called by two agents). No prohibited AI providers. Released under the **MIT License**. API keys are server-side only.

---

<div align="center">

From script to <em>shootable</em> location, with evidence.

</div>
