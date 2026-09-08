# Demo Evaluation — FINAL (live-measured 2026-09-06)

## Measured matrix (all real Gemini + real Parallel, new V-2/V-3 code)

| Run | Model | Latency | Candidates | Sources (official) | Top score/status |
|-----|-------|---------|-----------|--------------------|------------------|
| demo-a market | 3.6-flash | 46s | Chandni Chowk, Khari Baoli, Dharampura Haveli | 14 (8) | 61 FEAS (gated) |
| rel-a1 | lite | 19s | Chandni Chowk, Purani Dilli, Khari Baoli | 39 (23) | 68 FEAS (gated) |
| rel-a2 | lite | 20s | Chandni Chowk, Purani Dilli, Dariba Kalan | 36 (19) | 70 FEAS (gated) |
| rel-a3 | 2.5-flash | 64s | Chandni Chowk, Khari Baoli, Haveli Dharampura | 45 (24) | 72 FEAS (**gated from RECOMMENDED**) |
| demo-b fort | 3.6-flash | 56s | Amer, Chittorgarh, Mehrangarh | 11 (5) | 67 FEAS |
| demo-c river | 3.6-flash | 85s (incl. 503 retry) | Dashashwamedh, Assi, Manikarnika ghats | 11 (5) | 83 FEAS (gated) |
| demo-d colonial | lite | 50s (degraded, 503s) | BBD Bagh, Chandni Chowk, White Town | 0 (0) | 44 HIGH_RISK |
| demo-e monsoon | lite | 18s | Dadar Flower Mkt, Colaba, Chandni Chowk | 55 (29) | 74 REC |
| rel-e1 | 2.5-flash | 53s | Colaba only | 13 (8) | 67 FEAS |
| rel-e2 | 2.5-flash | 78s | Sadar Bazar, Mattuthavani, Dadar | 36 (14) | 81 REC |
| rel-e3 | 2.5-flash | 76s | Mullik Ghat, Dadar, Gudimalkapur flower mkts | 65 (2) | 59 FEAS |

## Weighted scoring (40 rel / 20 ev / 15 agentic / 15 visual / 10 latency)

- **A. Heritage night bazaar: 9.4** — 4/4 success; Chandni Chowk in all 4 runs (stable cluster); official sources 8–24 every run; night+heritage gating fires visibly every run; latency 18–64s (median ~33s).
- **E. Monsoon market: 8.3** — 4/4 success but candidate churn (different markets each run); official sources 2–29 (variable); latency 18–78s.
- **B. Fort confrontation: 7.1** — single clean run, superb specificity, needs reliability repeats.
- **C. Riverside: 6.5** — one clean run + 85s; backup only.
- **D. Colonial: excluded** — degraded run (transient 503s); correct conservative output, weak demo.

## FINAL DEMO SCENARIO

**A. Heritage night bazaar chase** — "A high-energy night chase through a crowded heritage bazaar with Mughal-era havelis, narrow galis, spice shops and festival crowds…"

## WHY THIS SCENARIO

- Predictable: Old Delhi bazaar cluster (Chandni Chowk 4/4) with 18–64s latency — safest live profile measured.
- Evidence-rich: 14–45 sources, 8–24 official-government per run, every run.
- The killer judge moment is built in: top score 72 displays **FEASIBLE_WITH_CONDITIONS + "Best available — no meaningful night-shooting evidence"** — the system visibly refuses to overclaim on stage.
- Backup: **E. Monsoon market** (shows a RECOMMENDED outcome + highest official-source peak).

## EXPECTED LIVE FLOW (≈60s, narrated)

1. Paste scene → Scene Intelligence parses (night shoot, heritage risk, crowd).
2. Research trail shows adaptive Parallel queries (ASI/heritage, night NOC, municipal, access).
3. Location Discovery returns Old Delhi bazaar candidates with source links.
4. Production Intelligence gathers permit evidence per candidate (concurrent).
5. Verdict cards: scores 60–72, gaps banner first ("Best available…"), official citations clickable.
6. Close: "It never told us the shoot is legal — it showed what is proven and exactly what is missing."

## WHY THIS IS THE STRONGEST JUDGE DEMO

- Technological: live Gemini + live Parallel + deterministic scoring, all visible in the trail.
- Design: verdict cards readable in 30s; uncertainty shown, not hidden.
- Impact: "3 days of fixer calls → 60 seconds of cited evidence" for a line producer.
- Idea: India-first permit intelligence with refusal-to-overclaim — memorable after 20 generic chatbots.
