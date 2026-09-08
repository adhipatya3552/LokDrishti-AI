# LokDrishti AI

LokDrishti AI turns a film scene into an evidence-backed production feasibility brief for real Indian locations.

## Why it exists

A line producer or location manager must answer two different questions before a shoot:

1. Does a real location visually fit the scene?
2. Can the crew plausibly shoot there under current permit, access, heritage, and operational conditions?

LokDrishti uses Gemini to understand the scene, Parallel Search to research the live web, and deterministic scoring to make the trade-offs visible.

## Agent workflow

1. **Scene Intelligence Agent** extracts visual and operational requirements.
2. **Location Discovery Agent** calls the Parallel Search API to find up to three grounded Indian candidates.
3. **Production Intelligence Agent** adapts its queries to the scene: night rules only matter for night scenes; heritage research is prioritized when the scene implies a heritage site; drone and vehicle research are triggered only when relevant.
4. **Evidence & Ranking** grades source-backed evidence and computes the transparent score in application code.

No permit claim is generated from model memory. The UI shows the source title, URL, excerpt, source type, and confidence returned by the research pipeline.

## Technology

- Next.js App Router + TypeScript
- Google Gen AI SDK (`@google/genai`) and Gemini structured output
- Parallel Search API at runtime (`POST https://api.parallel.ai/v1/search`)
- Tailwind CSS
- Server-side SSE route for live execution events

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Set these server-only variables in `.env.local`:

- `GOOGLE_API_KEY`
- `PARALLEL_API_KEY`
- Optional: `PARALLEL_API_URL`

Open `http://localhost:3000`.

## Scoring model

The score is deterministic and intentionally not a legal probability:

- Visual match: 30 points
- Permit evidence: 30 points
- Access and logistics evidence: 20 points
- Risk profile: 20 points

Authoritative sources and higher-confidence evidence contribute more. A prohibition or high-confidence restriction can move a location to high risk. Missing evidence never means permission is granted.

## Limitations and disclaimer

Parallel results can be incomplete, stale, or contradictory. LokDrishti is a research assistant, not a legal authority, permit issuer, or guarantee of shootability. Final permissions, fees, safety approvals, road closures, and access conditions must be confirmed with the relevant authority and on-site production professionals.

## Hackathon compliance notes

This is a new implementation. It uses Google Gemini / Google Cloud-compatible Gen AI tooling and the Parallel Search API at runtime. The repository is released under the MIT License. The application does not expose API keys to the browser.
