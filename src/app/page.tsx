'use client';

import { SceneInput } from '@/components/SceneInput';
import { AgentTimeline } from '@/components/AgentTimeline';
import { ComparisonMatrix } from '@/components/ComparisonMatrix';
import { LocationCard } from '@/components/LocationCard';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { AlertTriangle, Film, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { FeasibilityReport, SceneSpec, LocationCandidate } from '@/lib/schemas';
import { OrchestratorEvent, OrchestratorResult } from '@/lib/orchestrator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Tilt } from '@/components/Tilt';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSceneSpec(value: unknown): value is SceneSpec {
  return (
    isRecord(value) &&
    typeof value.setting_type === 'string' &&
    typeof value.time_of_day === 'string' &&
    isRecord(value.special_requirements)
  );
}

function isLocationCandidateArray(value: unknown): value is LocationCandidate[] {
  return (
    Array.isArray(value) &&
    value.every((item) => isRecord(item) && typeof item.id === 'string' && typeof item.name === 'string')
  );
}

function isFeasibilityReportArray(value: unknown): value is FeasibilityReport[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.candidate_id === 'string' &&
        typeof item.feasibility_score === 'number' &&
        isRecord(item.score_breakdown) &&
        Array.isArray(item.coverage_gaps) &&
        Array.isArray(item.evidence_items)
    )
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<OrchestratorEvent[]>([]);
  const [reports, setReports] = useState<FeasibilityReport[]>([]);
  const [sceneSpec, setSceneSpec] = useState<SceneSpec | null>(null);
  const [candidates, setCandidates] = useState<LocationCandidate[]>([]);
  const [finalResult, setFinalResult] = useState<OrchestratorResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cancelRequestedRef = useRef(false);

  const pushError = (message: string) =>
    setEvents((prev) => [...prev, { type: 'error', message, timestamp: Date.now() }]);

  const handleCancel = () => {
    cancelRequestedRef.current = true;
    abortRef.current?.abort();
  };

  const handleAnalyze = async (sceneText: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    cancelRequestedRef.current = false;
    setIsLoading(true);
    setEvents([]);
    setReports([]);
    setSceneSpec(null);
    setCandidates([]);
    setFinalResult(null);

    const safety = setTimeout(() => {
      controller.abort(new Error('Analysis timed out after 5 minutes. Please retry.'));
    }, 295000);

    const handleEvent = (event: OrchestratorEvent) => {
      setEvents((prev) => [...prev, event]);

      if (event.type === 'agent_end' && event.data) {
        if (event.agent === 'Scene Intelligence' && isSceneSpec(event.data)) {
          setSceneSpec(event.data);
        } else if (event.agent === 'Location Discovery' && isLocationCandidateArray(event.data)) {
          setCandidates(event.data);
        } else if (event.agent === 'Evidence & Ranking' && isFeasibilityReportArray(event.data)) {
          setReports(event.data);
        }
      }

      if (event.type === 'final_result' && isRecord(event.data)) {
        const result = event.data as unknown as OrchestratorResult;
        setFinalResult(result);
        if (isFeasibilityReportArray(result.reports)) setReports(result.reports);
        if (isLocationCandidateArray(result.candidates)) setCandidates(result.candidates);
        if (isSceneSpec(result.sceneSpec)) setSceneSpec(result.sceneSpec);
      }
    };

    let eventCount = 0;

    const parseLine = (line: string) => {
      const clean = line.replace(/\r$/, '');
      if (!clean.startsWith('data: ')) return;
      try {
        const event = JSON.parse(clean.slice(6)) as OrchestratorEvent;
        eventCount += 1;
        handleEvent(event);
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneText }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}. Please retry.`);
      }
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/event-stream')) {
        throw new Error('Unexpected server response. Please retry.');
      }
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          parseLine(line);
        }
      }

      buffer += decoder.decode();
      for (const line of buffer.split('\n')) {
        parseLine(line);
      }

      if (eventCount === 0) {
        pushError('Server returned an empty response. Please retry.');
      }
    } catch (err) {
      if (controller.signal.aborted && cancelRequestedRef.current) {
        pushError('Analysis cancelled.');
      } else {
        console.error('Analysis execution error:', err);
        pushError(err instanceof Error ? err.message : 'Unknown error during analysis execution.');
      }
    } finally {
      clearTimeout(safety);
      setIsLoading(false);
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const hasNoCandidates = !isLoading && finalResult && finalResult.candidates.length === 0;
  const hasNoEvidence = !isLoading && reports.length > 0 && reports.every((report) => report.total_source_count === 0);

  return (
    <div className="space-y-12">
      <section className="relative">
        <div className="hero-glow" aria-hidden="true" />
        <div className="relative flex flex-col items-center text-center space-y-6 py-4">
          <div className="stagger-in flex items-center gap-3 rounded-full border border-ink-700 bg-ink-900/40 px-4 py-2 backdrop-blur-sm" style={{ animationDelay: '0ms' }}>
            <Film className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-100">LokDrishti AI · Agentic Cinema Hackathon</span>
            <span className="text-ink-500">|</span>
            <span className="text-sm text-ash-300">Parallel Track</span>
          </div>
          <h1 className="stagger-in max-w-4xl font-serif text-5xl font-medium tracking-tight text-ash-50 md:text-7xl" style={{ animationDelay: '90ms' }}>
            From script to <em className="text-amber-400">shootable</em> location, with evidence.
          </h1>
          <p className="stagger-in max-w-2xl text-lg leading-relaxed text-ash-300 md:text-xl" style={{ animationDelay: '180ms' }}>
            An autonomous pre-production intelligence agent that turns creative film scene descriptions into evidence-backed, production-feasibility-ranked Indian locations using live municipal, ASI, and permit research.
          </p>
        </div>
      </section>

      <section>
        <SceneInput onAnalyze={handleAnalyze} onCancel={handleCancel} isLoading={isLoading} />
      </section>

      {events.length > 0 && (
        <section className="grid grid-cols-1 gap-6" aria-live="polite" aria-busy={isLoading}>
          <ErrorBoundary label="research trail">
            <AgentTimeline events={events} isLoading={isLoading} />
          </ErrorBoundary>
        </section>
      )}

      {hasNoCandidates && (
        <section className="rounded-2xl border border-amber-900/40 bg-amber-950/15 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <h2 className="font-serif text-2xl text-ash-50">No grounded candidates found</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ash-300">
                LokDrishti could not establish reliable Indian location candidates from the available live search evidence for this scene. Try simplifying the scene description or using a more common location type.
              </p>
            </div>
          </div>
        </section>
      )}

      {hasNoEvidence && (
        <section className="rounded-2xl border border-rose-900/40 bg-rose-950/15 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
            <div>
              <h2 className="font-serif text-2xl text-ash-50">Evidence could not be established</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ash-300">
                Live research did not produce enough reliable source-backed permit or feasibility evidence. LokDrishti will not infer permission from missing data. Authority confirmation is required.
              </p>
            </div>
          </div>
        </section>
      )}

      {reports.length > 0 && sceneSpec && (
        <>
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h2 className="font-serif text-3xl text-ash-50">Recommended Locations</h2>
            </div>
            <ErrorBoundary label="location cards">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {reports.map((report, index) => (
                  <div key={report.candidate_id} className="pop-in" style={{ animationDelay: `${index * 110}ms` }}>
                    <Tilt>
                      <LocationCard report={report} />
                    </Tilt>
                  </div>
                ))}
              </div>
            </ErrorBoundary>
          </section>

          <section>
            <ErrorBoundary label="comparison matrix">
              <ComparisonMatrix reports={reports} sceneSpec={sceneSpec} />
            </ErrorBoundary>
          </section>
        </>
      )}

      <section>
        <DisclaimerBanner />
      </section>
    </div>
  );
}
