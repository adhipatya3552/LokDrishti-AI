# IMPLEMENTATION_PLAN.md: LokDrishti AI

## 1. Product & Architectural Architecture
**LokDrishti AI** is an agentic pre-production intelligence platform for film & media production teams in India. It transforms creative script scenes into evidence-grounded location feasibility briefs.

### Key Workflows:
1. **Scene Analysis**: Parse film script scene into structured production requirements & risk triggers (`SceneSpec`).
2. **Location Candidate Discovery**: Perform multi-query search using **Parallel Search API** (`parallel-web` / `@parallel-web/ai-sdk-tools` or REST API) to find real candidate Indian locations.
3. **Adaptive Production Research**: Generate targeted legal, permit, ASI heritage, municipal NOC, and logistics research queries tailored to the specific scene requirements.
4. **Evidence Verification & Scoring**: Grade sources (Official Gov, News, Blog), detect insufficient or conflicting evidence, and calculate a transparent **Production Feasibility Score (0–100)**.
5. **Producer Brief Generation**: Present ranked options with clickable evidence citations on a cinematic dashboard.

---

## 2. Tech Stack & Deployment Strategy

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI / Radix primitives.
- **Agent Orchestration**: Google Gen AI SDK (`@google/genai` / `google-genai` / `@google/adk`), Gemini 2.0 Flash / 1.5 Pro with structured outputs (`response_schema`).
- **Live Search & Web Research**: Parallel Search API (`parallel-web` / `https://api.parallel.ai/v1/search`).
- **Backend**: Next.js Server-Sent Events (SSE) Route Handlers for real-time agent execution streaming.
- **License**: MIT License (OSI approved).

---

## 3. Data Schemas & Contracts

### `SceneSpec` Schema
```ts
export interface SceneSpec {
  setting_type: 'urban_market' | 'heritage_fort' | 'rural_village' | 'coastal_waterfront' | 'natural_landscape' | 'other';
  architectural_style?: string;
  geography_preference?: string;
  time_of_day: 'day' | 'night' | 'dusk' | 'dawn';
  weather_element?: string;
  crowd_density: 'high' | 'medium' | 'low';
  special_requirements: {
    night_shoot: boolean;
    heritage_risk: boolean;
    water_elements: boolean;
    stunt_pyrotechnics: boolean;
    drone_required: boolean;
    heavy_vehicles: boolean;
  };
  search_keywords: string[];
}
```

### `LocationCandidate` Schema
```ts
export interface LocationCandidate {
  id: string;
  name: string;
  district: string;
  state: string;
  description: string;
  visual_match_reasoning: string;
  discovery_sources: Array<{ title: string; url: string; snippet: string }>;
}
```

### `EvidenceItem` Schema
```ts
export interface EvidenceItem {
  id: string;
  claim: string;
  category: 'permit_rules' | 'heritage_restriction' | 'municipal_noc' | 'logistics_access' | 'recent_news';
  source_title: string;
  source_url: string;
  source_type: 'official_gov' | 'municipal_portal' | 'heritage_authority' | 'reputable_news' | 'general_web';
  snippet: string;
  confidence: 'VERIFIED' | 'SUPPORTED' | 'INSUFFICIENT' | 'CONFLICTING';
}
```

### `FeasibilityReport` Schema
```ts
export interface FeasibilityReport {
  candidate_id: string;
  candidate_name: string;
  feasibility_score: number; // 0-100 deterministic calculation
  score_breakdown: {
    visual_match: number; // 0-30
    permit_evidence: number; // 0-30
    logistics_access: number; // 0-20
    risk_profile: number; // 0-20
  };
  evidence_items: EvidenceItem[];
  risk_warnings: string[];
  key_permit_authorities: string[];
  recommendation_status: 'RECOMMENDED' | 'FEASIBLE_WITH_CONDITIONS' | 'HIGH_RISK_NOT_RECOMMENDED';
  insufficient_evidence_notice?: string;
}
```

---

## 4. Multi-Agent System Design

1. **`SceneParserAgent`**
   - *Input*: Film scene text.
   - *Logic*: Uses Gemini 2.0 Flash with `SceneSpec` JSON Schema.

2. **`LocationDiscoveryAgent`**
   - *Input*: `SceneSpec`.
   - *Tool*: Parallel Search API (`parallel-web`).
   - *Output*: 3 candidate Indian locations with visual match notes and source URLs.

3. **`ProductionIntelligenceAgent`**
   - *Input*: Candidate location + `SceneSpec`.
   - *Logic*: Dynamically selects research dimensions (e.g. night shooting rules, ASI heritage buffers, municipal shooting NOCs, police guidelines).
   - *Tool*: Parallel Search API (`parallel-web`).
   - *Output*: Raw extracted search evidence items with source metadata.

4. **`EvidenceRankingAgent`**
   - *Input*: Candidates + Evidence items.
   - *Logic*: Grades source authority, flags conflicts/insufficient data, computes transparent Feasibility Score, generates final producer brief.

---

## 5. Scoring Model Logic

```
Production Feasibility Score (0 - 100) = 
    Visual Match Score (0 - 30)
  + Permit Evidence Score (0 - 30)
  + Logistics & Access Score (0 - 20)
  + Risk Profile Score (0 - 20)
```
- **Visual Match (0-30)**: Relevancy of location geography and architecture to `SceneSpec`.
- **Permit Evidence (0-30)**: High score for clear government guidelines/NOC procedures found via Parallel; low score if prohibited or unbacked.
- **Logistics & Access (0-20)**: Road access, vehicle movement, proximity to production hubs.
- **Risk Profile (0-20)**: Night shoot bans, active construction, heritage buffer risks.

---

## 6. Directory Structure

```
agentic-cinema-hackathon/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── .env.example
├── README.md
├── ARCHITECTURE.md
├── DEMO.md
├── IMPLEMENTATION_PLAN.md
├── src/
│   ├── app/
│   │   ├── page.tsx (Cinematic Dashboard)
│   │   ├── layout.tsx
│   │   └── api/
│   │       └── analyze/
│   │           └── route.ts (SSE Streaming Agent Runner)
│   ├── lib/
│   │   ├── google-gemini.ts (Gemini client configuration)
│   │   ├── parallel-search.ts (Parallel Search API wrapper & tool)
│   │   ├── schemas.ts (TypeScript interfaces & JSON Schemas)
│   │   └── scorer.ts (Deterministic feasibility scoring engine)
│   ├── agents/
│   │   ├── scene-parser.ts
│   │   ├── location-discovery.ts
│   │   ├── production-intelligence.ts
│   │   └── evidence-ranking.ts
│   └── components/
│       ├── SceneInput.tsx (Preset selector & scene text area)
│       ├── AgentTimeline.tsx (Real-time multi-agent status log)
│       ├── ParallelStream.tsx (Live Parallel Search query & url tracker)
│       ├── LocationCard.tsx (Ranked candidate breakdown & evidence modal)
│       ├── ComparisonMatrix.tsx (Side-by-side production trade-off table)
│       └── DisclaimerBanner.tsx (Legal & AI transparency notice)
```

---

## 7. Estimated Implementation Phases

- **Phase 1**: Initialize Next.js 15 project + Tailwind CSS + Radix UI + dependencies. Setup `.env.example`.
- **Phase 2**: Implement core Gemini & Parallel Search SDK integration modules (`src/lib/`).
- **Phase 3**: Implement the 4 specialized agent modules in `src/agents/`.
- **Phase 4**: Build Next.js SSE route handler in `src/app/api/analyze/route.ts` for real-time agent execution.
- **Phase 5**: Develop dark-mode cinematic UI components in `src/components/`.
- **Phase 6**: Integrate UI with backend stream and test real Indian locations against Parallel Search.
- **Phase 7**: Add `README.md`, `ARCHITECTURE.md`, `DEMO.md`, and open-source license. Run end-to-end verification.
