# Final Release Audit (2026-09-06, post live-verification)

## Release diff since FINAL_AUDIT.md

- `src/lib/scorer.ts`: critical-dimension recommendation gating (V-2), live-unit-tested + live-measured (72 → FEASIBLE with marker).
- `src/agents/location-discovery.ts`: specificity instructions (V-3); city-level candidates eliminated in all 5 fresh demo runs.
- `src/lib/google-gemini.ts`: `GEMINI_MODEL` override (V-1, default unchanged).
- `next.config.mjs`: `output: 'standalone'`; new `Dockerfile` + `.dockerignore` (Cloud Run path).
- New docs: `RELEASE_COMPLIANCE_CHECK.md`, `JUDGE_SCORECARD.md`, `SUBMISSION_CHECKLIST.md`, this file.
- `FINAL_AUDIT.md` (NOT READY) is superseded by this audit for the release decision; its quota blocker was resolved by the midnight-PT reset + model rotation.

## Agent proof (what the system decides — measured)

| Decision | Where | Live evidence |
|----------|-------|---------------|
| Scene dimensions | scene-parser (Gemini + schema) | night/heritage/drone/stunt flags differ per scene (t1 vs t2 vs t5 vs t7 traces) |
| Research dimensions | `decideResearchDimensions` | ASI+night+police (t1) vs ASI-only (t2) vs drone (t5/t8) vs base (t7) |
| Query wording | `buildDiscoveryQueries` / `buildProductionQueries` | query strings differ per SceneSpec in every run |
| Candidate selection | discovery (Gemini over search results) | different candidates per scene; specificity improved post-V-3 |
| Evidence interpretation | production agent (claim/category/support) | 100s of extracted items, URL-matched, code-scored |
| Uncertainty → recommendation | scorer gating (V-2) | 72 gated live (rel-a3); 83 gated (demo-c) |
| Honest bounds | fixed templates, ≤3 candidates, fixed weights, code-computed authority/state | documented, not hidden |

Accurate term: **adaptive agentic research pipeline with constrained execution templates.**

## Parallel centrality (killer-feature case)

- Without Parallel: every report → ~30–40/HIGH_RISK, full gaps (proven by t6 shape). Gemini alone would be an ungrounded chatbot.
- With Parallel: fresh citations (tourism.rajasthan.gov.in, indiacinehub.gov.in, mcgm.gov.in, udma.wb.gov.in, thehindu/TOI), 20+ live calls, zero failures.
- Demo makes it obvious: scene → agent plan → live queries (visible) → evidence → Gemini interpretation → deterministic score.

## Adversarial failure matrix (A–H)

| Test | Method | Result |
|------|--------|--------|
| A. Gemini 429 | live (t6) | degraded to scored HIGH_RISK + gaps, error surfaced, no crash, no hallucination |
| B. Parallel timeout | code (20s abort + retry) | never triggered in 20+ live calls; path exists, untested live — stated |
| C. Empty Parallel results | code guard (P0-1) + near-empty live (adv-empty: 3 weak sources → 37–40 HIGH_RISK) | PASS |
| D. Weak evidence | live (multiple) + unit | weak claims → INSUFFICIENT, low weights, never RECOMMENDED (unit: 45 HIGH_RISK) |
| E. Conflicting evidence | unit (state machine + penalties verified) | warnings + risk penalty verified; **no live conflict detector feeds `contradictionCount` (P2)** — stated |
| F. Injection in scene | live (t10) | neutralized, zero injected strings |
| F2. Malicious claim in web content | unit (weak "granted" claim) | 45 HIGH_RISK; cannot lift status (weights) — stated as unit-level, not live |
| G/H. Single + partial failure | live (t10-Samode 503, demo-d 503s, adv-empty 429) | `allSettled` isolation; survivors scored, failures gapped |

## Performance (final measured)

- Overall live range 16–140s, median ≈ 60s. Demo A: 18–64s (median ~33s). Demo E: 18–78s.
- Per run: 5 Gemini + 4 Parallel HTTP calls; production research concurrent; ranking <12ms.
- 60–90s demo wait is acceptable with the narrated live trail (real events, no fake progress — verified in `AgentTimeline.tsx`).

## Production build / security (Phase 12)

- `npm run build` passes (standalone `server.js` emitted); `npm test` passes; `tsc` clean via build.
- Keys: `process.env` server-only; client static JS bundle-grepped clean (no `x-api-key`/SDK markers); `.env*` gitignored; no key values printed/logged/committed.
- No mocks, no hardcoded results, no `console.log`, no TODOs in `src/`; repo contains only intended files (temp harnesses lived in Temp, deleted from repo).

## Deployment strategy (Phase 13)

- **Primary: Google Cloud Run** — no request-timeout risk for 60–140s SSE runs, Secret Manager for keys, strengthens the "built using Google Cloud" narrative. `Dockerfile` provided; needs `gcloud` auth + project/region config, then `gcloud run deploy` (user action; Docker unavailable on this machine so image build happens via Cloud Build).
- **Fallback: Vercel Pro** — Hobby's ~60s function limit will kill long runs; do NOT deploy Hobby. Pro supports `maxDuration: 300`.
- Replit hosting is NOT required for the Parallel track (only the Replit track mandates it).

## Billing / quota (Phase 3 close-out)

- Free tier observed: 20 req/day/model + ~10 req/min; one E2E ≈ 5 calls. Post-reset budget math worked (rotated 3 models across 12 runs).
- Before judged demo or heavy rehearsal: enable pay-as-you-go on the Google project behind the key (AI Studio/GCP billing console — project owner action, ~2 min), keep `GEMINI_MODEL` override, pace runs ≥60s apart. Without billing, a mid-demo 429 remains possible (demonstrated twice).

## Hostile judge simulation (19 — answered from implementation)

1. Agent not chatbot: plans research, calls tools, scores deterministically; traces differ per scene.
2. Gemini decides: parse, select, extract — inside schemas; authority/state/score are code.
3. Parallel does: all external evidence (4 HTTP calls/run).
4. Parallel essential: removal → all HIGH_RISK/gaps (measured shape).
5. Parallel returns nothing: P0 guard → empty evidence → conservative scores + gaps (adv-empty live).
6. Hallucination prevention: URL-matched extraction, code states, silence≠permission, gating, audited live.
7. Confidence: authority×state weights + coverage gaps + "Best available" markers — shown, not a black box.
8. Deterministic: classification, states, weights, gating, ranking.
9. Scene differences: query dimensions + candidates + gating triggers (traces prove it).
10. Producer value: days of permit research → ~60s cited brief with named authorities/fees.
11. Better than Google search: agent plans, extracts, scores, compares — with citations a search page lacks.
12. Better than marketplaces: permit-evidence for real locations, not venue listings.
13. Different from StudioBinder: pre-production permission intelligence, not production management.
14. India-first: single-window systems, ASI rules, state policies, .gov.in citations — measured.
15. Conflicting sources: state machine + penalties exist and are unit-verified; live detector absent (P2 — stated openly).
16. API failures: measured graceful degradation (429/503), never crash/never invent.
17. Production-ready: build, types, timeouts/retries, isolation, secrets hygiene, bundle-verified.
18. Biggest limitation: discovery granularity outside heritage + no live conflict detector + free-tier fragility without billing.
19. Parallel-track prize: Parallel is the product's senses — every claim on screen traces to a live Parallel result; the demo's most memorable moment (refusal to overclaim) is powered by absence/presence of Parallel evidence.

## Final review (4 criteria)

- Technical: expert sees real orchestration + genuine Google/Parallel integration — yes.
- Design: judge understands in 30s (verdict cards + gaps) — yes.
- Impact: producer gets the time-saving instantly — yes, if narrated.
- Idea: remembered after 20 chatbot demos — yes: "the agent that refuses to say legal."

## Remaining blockers (all user-side, none code-side)

1. Billing (or careful quota pacing) before judged demo.
2. `git init` + public GitHub push + About/license visibility.
3. Deploy (Cloud Run primary) + verify hosted == video.
4. Record ≤3-min video after rehearsing demo A (backup E).
5. Devpost form (Parallel track) + description + learnings.

## Final status

**READY FOR DEMO**

All 12 release gates pass: compliance verified against official rules; Google + Parallel runtime verified live; demo A works repeatedly (4/4) with 3×+ reliability; no hallucination path (audited, gated, unit-tested); failure behavior measured acceptable; build passes; secrets verified server-side down to bundle grep; deployment path known; hostile questions answerable without invention. Do not confuse with submission-complete: repo push, deploy, video, and Devpost filing remain.
