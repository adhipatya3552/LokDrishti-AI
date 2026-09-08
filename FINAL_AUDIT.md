# Final Audit — live verification 2026-09-06

> SUPERSEDED for the release decision by `FINAL_RELEASE_AUDIT.md` (READY FOR DEMO). This file is preserved as the
> verification-session record. Its NOT READY verdict reflected the pre-reset quota block, since resolved.

## 1. Hackathon compliance
- Uses Google Gemini via `@google/genai` (live-verified on `gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-3.6-flash`).
- Uses Parallel Search API at runtime in location discovery and production research (15+ live calls, zero failures).
- New codebase, MIT license, no prohibited AI providers in code.
- Demo video: still pending. Live deployment URL: still pending.

## 2. Google technology compliance
- Structured Gemini output through `@google/genai` with JSON-schema responses — demonstrated live across 11 runs.
- No Google ADK. Accepted-package wording (`google-genai` listed) is the basis for compliance; recheck final submission wording.

## 3. Parallel compliance — VERIFIED LIVE
- Sole external-evidence source: 1 discovery + 1 per-candidate HTTP call per run (4 total for 3 candidates).
- Without Parallel every report collapses to ~30–40/HIGH_RISK with full gaps (proven by the t6 quota-degraded run shape: no sources → conservative scores, no invented permits).
- Timeout (20s), bounded retries, 429 backoff all present in code; Parallel itself never throttled during verification.

## 4. Agentic architecture verification — VERIFIED LIVE (with honest bounds)
- Research strategy genuinely adapts: heritage→ASI queries, night→night-NOC, drone→DGCA/airspace, stunt/pyro→police + road-closure (traces differ across t1/t2/t5/t7/t8).
- Fixed scaffolding (honest): dimension→query templates, ≤3 candidates, fixed scorer weights. Verdict: **adaptive strategy selection over fixed execution templates** — an agentic pipeline, not open-ended planning, not hardcoded.

## 5. Evidence-grounding verification — VERIFIED LIVE
- 11 runs audited: no invented locations-as-facts beyond search grounding (one relevance miss: Golden Temple for river-ghats scene; one granularity weakness: city-level candidates for highway-pyro scene).
- No invented fees/NOCs presented as VERIFIED; weak-source claims correctly INSUFFICIENT.
- No-result → HIGH_RISK + full gaps (t6). Injection → neutralized (t10). No `PERMISSION_GRANTED/DENIED` strings exist in `src/`.

## 6. Security verification
- Keys server-side only, `.env.local` gitignored (verified), no key values printed/logged/committed during verification.
- Injection hardening live-tested (t10 PASS). Scene text treated as data; keyword sanitizer strips instruction patterns.

## 7. Reliability verification — PARTIAL, BLOCKER FOUND
- Production build passes (Next 15.5.2, compiled in 43s, types clean).
- Graceful degradation proven live: mid-run Gemini 429 (t6) and 503 (t10-Samode) → conservative scored reports, error events, no crash, no hallucinated permits.
- **Blocker: Gemini free-tier quota (20 req/day/model).** One E2E ≈ 5 calls ≈ 25% of daily budget. Mid-demo 429 is a demonstrated risk. Demo matrix + 3× reliability runs could not complete. **Do not run a judged demo on free-tier quota — enable billing first.**

## 8. Performance results — MEASURED (no estimates)
- End-to-end: 16–140s, median ≈ 60s (11 runs). Scene Intel 1.4–51s / Discovery 4.7–29s / Production Intel 2.6–96s / Ranking <12ms.
- Per run: 5 Gemini + 4 Parallel HTTP calls; candidate research concurrent (`Promise.allSettled`).
- No latency claim below measured values exists in docs; none added.

## 9. Demo scenario — PROVISIONAL (not locked)
- Provisional winner from measured analogues: **A. Heritage market chase** (smoke: 94 sources, 48 official, 80.5s). See `DEMO_EVALUATION.md`.
- Riverside (C) has only degraded-run data — excluded until a clean run. Colonial old-city (D) untested.
- 3× reliability repeats: BLOCKED (quota). Resume plan in `DEMO_EVALUATION.md`.

## 10. Remaining risks
- Quota/billing unresolved (P0 for demo day).
- Discovery granularity for non-heritage scenes (city-level candidates, listicle grounding) — P2.
- RECOMMENDED status not gap-gated (Colaba 91 with municipal gap) — gaps are surfaced, label is lenient; decide if judges will probe this.
- Demo video + hosted URL still pending.

## Hostile judge simulation (brutally honest)

1. **Why an agent, not a chatbot?** It doesn't converse — it plans research (dimensions per scene), calls search tools with generated queries, extracts structured evidence, and scores deterministically. Traces prove per-scene strategy differences.
2. **Autonomous decisions?** Scene parsing, candidate selection from evidence, which permit dimensions to research, which claims are source-backed. Fixed: templates, candidate cap, weights.
3. **Why is Parallel necessary?** Only evidence source; removal collapses all reports to HIGH_RISK/gaps. Gemini alone would be an ungrounded chatbot.
4. **What does Gemini contribute?** Understanding (parse), judgment (select/extract), all constrained by schemas + code-computed authority/state.
5. **Hallucination prevention?** URL-matched extraction only, code-computed states, empty-result guards, no permission-inference-from-silence, conservative defaults. Measured across 11 runs.
6. **No evidence?** t6: scores 43–48, HIGH_RISK, full gaps, error surfaced. Never grants.
7. **Conflicting sources?** `CONFLICTING_EVIDENCE` state exists in code and penalizes risk score; no live conflict was observed in 11 runs — untested live, say so.
8. **What does the score mean?** 0–100 weighted sum (visual 30 / permit 30 / logistics 20 / risk 20), authority×state-weighted. A producer-readable ranking with gaps and warnings — not a legal verdict. Say that on stage.
9. **Why should a line producer care?** Single-window permit paths, named authorities (ASI/Municipal/Police), fee rules with official citations, location trade-offs — in ~60s vs days of fixer calls.
10. **Vs StudioBinder?** StudioBinder manages productions you plan; this researches where you *can* shoot and what permission evidence exists — pre-production intelligence, not shot lists.
11. **Vs location marketplaces?** Marketplaces list spaces for hire; this grounds public-permit evidence (single-window systems, ASI rules, NOC paths) for real Indian locations with citations.
12. **India-first meaning?** Single-window clearance systems, ASI/monument rules, MCGM/police NOCs, state film policies with official .gov.in citations — measured, not asserted.
13. **Strongest weakness?** Discovery granularity outside heritage (city-level candidates, listicle grounding) + free-tier quota fragility + RECOMMENDED label leniency vs gaps.
14. **Live demo failure causes?** Gemini 429/503 (demonstrated), 80–140s latency variance, a thin-evidence scene producing all-HIGH_RISK (honest but flat demo). Mitigations: billed project, rehearsed scene = provisional winner A, narrated loading states.
15. **Hackathon rules?** Gemini + Parallel runtime use verified; MIT license; no banned AI; ADK absent (accepted-package defense); demo video + hosted URL still required before submission.

## Final status

**NOT READY FOR DEPLOYMENT**

Reasons: (a) demo-scenario matrix + 3× reliability runs blocked by Gemini free-tier quota — no locked demo; (b) judged demo on free tier is unsafe (demonstrated mid-run 429) — billing required; (c) demo video + hosted URL pending. Code, grounding, injection resistance, degradation, and build are verified live. Resume: enable billing (or post-reset quota), run `DEMO_EVALUATION.md` resume plan, re-run this audit's blocked items, then flip this verdict.
