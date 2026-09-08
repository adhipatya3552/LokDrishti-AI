# Judge Scorecard (4 official criteria, equal weight)

## 1. Technological Implementation — "How well built, how effectively Google Cloud + Partner services are used"

- **Demonstrates:** Gemini structured-output parsing/extraction (5 calls/run, 3 models live-tested); direct Parallel Search API integration (sole evidence source, 15+ live calls, 0 failures); deterministic code-computed authority/state/scoring; SSE streaming pipeline; `Promise.allSettled` candidate isolation; timeout+retry+429 handling; server-side secrets; production Next.js build.
- **Strongest evidence:** 11-run live matrix with per-run traces (queries adapt per scene; t6/t10 graceful degradation measured, not asserted).
- **Weakest area:** No Google Cloud *hosting* yet (runs on Gemini API, not Vertex/Agent Engine — allowed, but Cloud Run hosting would strengthen the story). No ADK (explicitly not required; accepted-package defense documented).
- **Safe improvements:** Cloud Run deployment (Phase 13); recommendation gating (Phase 4).
- **Demo moment:** Live query trace panel — scene in, adaptive Parallel queries out (heritage→ASI, night→NOC, drone→airspace), then scored cards with citations.

## 2. Design — "Complete, coherent product experience, not a technical POC"

- **Demonstrates:** Cinematic UI; real SSE stage events (Scene Intelligence → Location Discovery → Production Intelligence → Evidence & Ranking); evidence cards with source links + authority badges; coverage gaps and insufficient-evidence notices rendered, not hidden; empty states (P0-2).
- **Strongest evidence:** Uncertainty is a first-class UI citizen (gaps, warnings, evidence-state badges) — rare in hackathon demos.
- **Weakest area:** 60–90s wait needs a narrated loading story; score meaning (0–100 weights) must be explainable in one sentence on stage.
- **Safe improvements:** Verify the 7 planned stage labels of Phase 11 map 1:1 to real emitted events (no fake progress); one-line score legend in UI if missing.
- **Demo moment:** Judge reads a verdict card: score breakdown + "Night-shooting evidence missing" gap + official .gov.in citation links — trust in 30 seconds.

## 3. Potential Impact — "Credible, specific case for a real problem + real audience"

- **Demonstrates:** Line producers/location managers currently burn days on fixer calls for permits (single-window systems, ASI rules, police/municipal NOCs); LokDrishti compresses that to ~60s of cited, state-specific evidence with named authorities and fee rules.
- **Strongest evidence:** Measured official-source density (e.g. 48 official citations in the Rajasthan run: single-window clearance, SSO portal, fee schedules, Film Policy 2025).
- **Weakest area:** No producer testimonial; scale-beyond-demo is asserted (stateless pipeline scales horizontally — true by architecture, but unproven under load).
- **Safe improvements:** None in code. Submission text should name the audience (line producers, production fixers, state film facilitation offices) and the cost (permit delays kill shoot days).
- **Demo moment:** "This answer used to take 3 days of phone calls" → show the Rajasthan single-window + fee evidence with citations.

## 4. Quality of Idea — "Creative, non-obvious use; genuine problem understanding"

- **Demonstrates:** India-first permit intelligence (not locations — *permission evidence*); inverts the usual flow (evidence first, recommendation derived, never asserted); conservative-by-design scoring (no-evidence → HIGH_RISK, never granted); Parallel as live proprioception over a frozen LLM.
- **Strongest evidence:** t6/t10 runs: the system visibly refuses to grant what it cannot prove. Most agent demos fail this test.
- **Weakest area:** Memorability risk — "research agent with citations" is a crowded shape; the differentiator (permit-evidence conservatism + India film-bureaucracy specificity) must be said out loud, not hoped for.
- **Safe improvements:** Demo script + submission text must state the one-liner: "LokDrishti never tells you a shoot is legal — it shows you the evidence for what is, and tells you exactly what is missing."
- **Demo moment:** The gap banner on a top-scored card ("RECOMMENDED — municipal NOC evidence missing") — judges remember honesty.
