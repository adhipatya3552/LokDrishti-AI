# Submission Checklist

- [x] Official rules verified (`RELEASE_COMPLIANCE_CHECK.md`, rules fetched 2026-09-06)
- [x] Google requirement verified (`@google/genai` = accepted package; ADK correctly NOT added)
- [x] `google-genai` / ADK question resolved (ADK optional, not mandatory)
- [x] Parallel runtime verified (direct Search API calls in code, 15+ live calls, 0 failures)
- [x] New-project requirement verified (created in-period; **user must `git init` + push**)
- [x] Open-source license verified (MIT `LICENSE` present; **user must set GitHub About section**)
- [x] No prohibited AI providers (only `@google/genai`; re-grep before submit)
- [x] Real Gemini runtime (11 live runs, 3 models)
- [x] Real Parallel runtime (live web results in every successful run)
- [x] Evidence-grounded claims (audit: no VERIFIED fabrication in 11 runs)
- [x] No hallucinated permits (no-result → HIGH_RISK; no PERMISSION_GRANTED strings in `src/`)
- [x] Prompt injection defense (t10 live PASS)
- [x] Failure handling (`allSettled` isolation measured live)
- [x] Production build passes (standalone verified)
- [ ] Demo scenario selected (provisional: A heritage market chase; lock after live matrix)
- [ ] 3x reliability verified (blocked: quota — resume post-reset/billing)
- [ ] Hosted URL (user action: deploy per Phase 13, then verify hosted == video)
- [ ] Public GitHub repository (user action: init, push, About + license)
- [ ] Demo video <=3 minutes, YouTube/Vimeo public, English (user action after demo lock)
- [ ] Devpost submission ready (form: Parallel track selected, description, findings/learnings)

## User actions that cannot be done from this session

1. **Quota/billing**: enable pay-as-you-go on the Google project behind `GOOGLE_API_KEY` (AI Studio billing page or Cloud Billing for the project) — OR wait for the free-tier daily reset (~midnight Pacific) and run the resume plan immediately.
2. **GitHub**: `git init`, commit, create public repo, push, set About section (topics + license display).
3. **Deploy**: Cloud Run primary (Dockerfile provided; needs `gcloud` auth + `REGION`/`PROJECT` config) or Vercel Pro (Hobby 60s timeout will kill 60–140s runs — do NOT use Hobby).
4. **Video**: record ≤3 min after demo lock, upload unlisted/public YouTube, link in form.
5. **Submit**: Devpost form with Parallel track, hosted URL, repo URL, video URL, description.
