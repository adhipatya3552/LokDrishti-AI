# Release Compliance Check (official rules, verified 2026-09-06)

Sources: https://agentic-cinema.devpost.com/rules (Official Rules), https://agentic-cinema.devpost.com/ (track requirements), Devpost blog participant resources.
Deadline: **Sep 9, 2026 @ 2:00pm PDT** (9pm UTC). Judging Sep 23–Oct 7. Stage One is pass/fail (possibly automated); Stage Two scores 4 equal-weighted criteria.

| # | Requirement | Official wording (essence) | Current implementation | Status | Action |
|---|-------------|---------------------------|------------------------|--------|--------|
| 1 | Gemini requirement | "Build a functional agent—powered by Gemini…" | `@google/genai` SDK, Gemini 2.5 Flash/Lite + 3.6 Flash, structured JSON output, live-verified 11 runs | PASS | None |
| 2 | Google Cloud / Agent Builder | "built using Google Cloud"; repo "must demonstrate the use of Google Cloud … at runtime in your code — imported and actually called" | `GoogleGenAI` imported in `src/lib/google-gemini.ts`, called on every run (5 calls/E2E); Gemini is a Google Cloud AI service per cloud.google.com/terms/services | PASS (code) | Strengthen narrative via Google Cloud hosting (see Phase 13) |
| 3 | Accepted Google packages | "google-adk, google-genai, google-generativeai, or google-cloud-aiplatform (any generation)" | `@google/genai` (npm distribution of google-genai) in `package.json` | PASS | None |
| 4 | `@google/genai` sufficiency | Explicitly listed as accepted | Used as primary AI runtime | PASS | None |
| 5 | ADK mandatory? | **No.** ADK is one accepted option, not a requirement | Not used — correctly, per rule text | N/A — do not add | None. DO NOT introduce ADK |
| 6 | Agent Engine mandatory? | Not in binding Requirements; appears only in marketing/resources as one path | Not used | N/A | None |
| 7 | Google Cloud runtime/hosting | No mandated host for non-Replit tracks; project must "run on web, Android, or iOS" | Next.js web app; deploy target TBD (Phase 13) | OPEN | Choose Vercel or Cloud Run; Cloud Run strengthens (2) |
| 8 | Parallel runtime | "must actively use Parallel's Search API at runtime … the integration must be present in your code" (examples non-exhaustive: "for example") | Direct HTTPS POST to `https://api.parallel.ai/v1/search` with `x-api-key` in `src/lib/parallel-search.ts`, called by 2 agents on every user run; 15+ live calls measured, zero failures | PASS | None. Keep direct REST (see note) |
| 9 | New project | "newly created by the entrant during the Contest Period" (Jul 27–Sep 9, 2026) | Codebase created in-period (files dated Aug 2026); **no git repo exists yet** | OPEN (user action) | `git init` + push to public GitHub before deadline |
| 10 | Open source | "public and open source, with an open-source license file detectable at the top of the repository page (About section)" | MIT `LICENSE` present in project | OPEN (user action) | Push + set GitHub About section + license detection |
| 11 | License | OSI-approved (rules §12: "Open Source Initiative-approved license") | MIT | PASS (on push) | None |
| 12 | Hosted project | "Include a URL to the hosted Project for judging and testing" + must "function as depicted in the video" | Not deployed yet | OPEN | Deploy (Phase 13), then verify hosted == video |
| 13 | Demo video | ≤3 min (only first 3 min judged), YouTube/Vimeo public, English, shows project functioning | Not recorded | OPEN (user action) | Record after demo lock |
| 14 | Partner track | Select Parallel track on submission form | Decision: Parallel | OPEN (user action) | Select at submission |
| 15 | Prohibited AI | "No other AI models, agent frameworks, or AI APIs … including AWS, Microsoft, OpenAI, Anthropic" | Only `@google/genai`; grep-verified no other AI imports | PASS | None; keep dependency hygiene |
| 16 | Attribution | License detectable (About); video original content, no third-party marks | LICENSE present; video TBD | OPEN (video) | Ensure no trademarked footage in video |

## Parallel integration note (why direct REST, not the SDK)

The rule lists example integrations ("for example, via the official parallel-web SDK … or a Grounding configuration"). Our integration POSTs `objective + search_queries + mode` to the Search API endpoint with key auth, in code, on the user path, with results driving candidates → evidence → scores (measured). This satisfies "actively use … at runtime … present in your code." Switching SDKs now would cost quota re-verification and add risk with no compliance gain. If Stage-One automation greps for "parallel", our code matches (`parallel-search.ts`, `PARALLEL_API_KEY`, `api.parallel.ai`, `parallelSearch`).

## AI-limitation hygiene (must hold through submission)

- No new AI dependencies. No agent frameworks. No embeddings/vector-DB SDKs with built-in AI. Reviews of `package.json` before submit.
- Non-AI third-party services (hosting, frameworks) are explicitly unrestricted — Vercel/Cloud Run/YouTube are safe.
