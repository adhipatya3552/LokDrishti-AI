# LokDrishti AI Architecture

## System flow

```text
Producer scene brief
        |
        v
Scene Intelligence Agent
        | SceneSpec JSON
        v
Location Discovery Agent ---- Parallel Search: visual/location queries
        | candidates + discovery sources
        v
Production Intelligence Agent ---- Parallel Search: adaptive permit/access queries
        | source-backed EvidenceItem[]
        v
Evidence & Ranking
        | deterministic scoring in scorer.ts
        v
Producer-ready ranked brief + source trail
```

## Agent responsibilities

### Scene Intelligence
Input: raw scene description.
Output: `SceneSpec` with setting, time, atmosphere, geography, and only reasonably implied operational requirements.

### Location Discovery
Input: `SceneSpec`.
Tool: Parallel Search API.
Output: up to three real Indian candidates, each grounded in search result evidence.

### Production Intelligence
Input: candidate + `SceneSpec`.
Tool: Parallel Search API.
Output: evidence items categorized as permits, municipal NOC, heritage, night shooting, drone, access, or recent news. Query dimensions are conditional on scene requirements.

### Evidence & Ranking
Input: candidate and evidence items.
Output: `FeasibilityReport`.
The current implementation computes this in `src/lib/scorer.ts`, ensuring the same evidence produces the same approximate score. Claims remain tied to source URLs.

## Parallel integration

`src/lib/parallel-search.ts` calls the official endpoint with `x-api-key`, `objective`, `search_queries`, and `mode`. The orchestrator emits query and source events only after the underlying runtime call has been made. This keeps the visible research stream truthful.

## Evidence flow

Parallel returns `{url, title, publish_date, excerpts}`. The production agent asks Gemini to extract only claims supported by those fields. Each resulting `EvidenceItem` stores the source URL, excerpt, source type, confidence, and optional publication date. The UI labels insufficient evidence and never treats missing permit information as approval.

## Score model

```text
score = visual_match / 30
       + permit_evidence / 30
       + logistics_access / 20
       + risk_profile / 20
```

Source authority and evidence confidence affect evidence components. Risk deductions are applied for supported prohibitions, restrictions, night constraints, drone constraints, and active access issues.

## Deployment

The app is a single Next.js deployment. The `/api/analyze` Node.js route runs the server-side agent pipeline and streams SSE events. API keys are environment variables and never appear in client bundles.
