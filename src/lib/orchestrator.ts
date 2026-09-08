import { locationDiscoveryAgent } from '@/agents/location-discovery';
import { productionIntelligenceAgent } from '@/agents/production-intelligence';
import { sceneParserAgent } from '@/agents/scene-parser';
import { computeFeasibilityReport } from '@/lib/scorer';
import { EvidenceItem, FeasibilityReport, LocationCandidate, SceneSpec } from '@/lib/schemas';

export interface OrchestratorEvent {
  type: 'agent_start' | 'agent_end' | 'parallel_query' | 'parallel_result' | 'error' | 'warning' | 'final_result';
  agent?: string;
  message?: string;
  query?: string;
  sources?: Array<{ title: string; url: string; snippet: string }>;
  data?: unknown;
  timestamp: number;
}

export interface OrchestratorResult {
  sceneSpec: SceneSpec;
  candidates: LocationCandidate[];
  evidence: Record<string, EvidenceItem[]>;
  reports: FeasibilityReport[];
}

export async function runOrchestrator(
  sceneText: string,
  onEvent: (event: OrchestratorEvent) => void
): Promise<OrchestratorResult> {
  const emit = (event: Omit<OrchestratorEvent, 'timestamp'>) => onEvent({ ...event, timestamp: Date.now() });

  try {
    emit({ type: 'agent_start', agent: 'Scene Intelligence', message: 'Understanding production requirements from the scene.' });
    const sceneSpec = await sceneParserAgent(sceneText);
    emit({ type: 'agent_end', agent: 'Scene Intelligence', message: 'Scene requirements extracted.', data: sceneSpec });

    emit({ type: 'agent_start', agent: 'Location Discovery', message: 'Discovering Indian location candidates with Parallel Search.' });
    const discovery = await locationDiscoveryAgent(sceneSpec);
    for (const query of discovery.trace.queries) {
      emit({ type: 'parallel_query', agent: 'Location Discovery', query, message: 'Parallel Search query executed.' });
    }

    if (discovery.candidates.length === 0) {
      emit({
        type: 'warning',
        agent: 'Location Discovery',
        message: 'No candidate locations were discovered from the available live evidence.',
      });
      const result = { sceneSpec, candidates: [], evidence: {}, reports: [] };
      emit({ type: 'final_result', message: 'LokDrishti analysis complete with no candidates.', data: result });
      return result;
    }

    for (const candidate of discovery.candidates) {
      emit({
        type: 'parallel_result',
        agent: 'Location Discovery',
        message: `Candidate found: ${candidate.name}`,
        sources: candidate.discovery_sources,
      });
    }
    emit({ type: 'agent_end', agent: 'Location Discovery', message: `Discovered ${discovery.candidates.length} candidates.`, data: discovery.candidates });

    emit({ type: 'agent_start', agent: 'Production Intelligence', message: 'Researching permits, restrictions, and access evidence.' });

    const settled = await Promise.allSettled(
      discovery.candidates.map(async (candidate) => {
        const research = await productionIntelligenceAgent(candidate, sceneSpec);
        return { candidate, research };
      })
    );

    const evidence: Record<string, EvidenceItem[]> = {};
    for (const result of settled) {
      if (result.status === 'fulfilled') {
        const { candidate, research } = result.value;
        evidence[candidate.id] = research.evidenceItems;

        for (const query of research.trace.queries) {
          emit({ type: 'parallel_query', agent: 'Production Intelligence', query, message: `${candidate.name} query executed.` });
        }

        if (research.evidenceItems.length === 0) {
          emit({
            type: 'warning',
            agent: 'Production Intelligence',
            message: `${candidate.name}: no reliable evidence established from live search results.`,
          });
        }

        for (const item of research.evidenceItems.slice(0, 8)) {
          emit({
            type: 'parallel_result',
            agent: 'Production Intelligence',
            message: `[${item.evidence_state}] ${item.claim}`,
            sources: [{ title: item.source_title, url: item.source_url, snippet: item.evidence_excerpt }],
          });
        }
      } else {
        emit({
          type: 'error',
          agent: 'Production Intelligence',
          message: result.reason instanceof Error ? result.reason.message : 'Candidate research failed.',
        });
      }
    }

    emit({ type: 'agent_end', agent: 'Production Intelligence', message: 'Evidence collection complete.', data: evidence });

    emit({ type: 'agent_start', agent: 'Evidence & Ranking', message: 'Calculating production feasibility scores.' });
    const reports = discovery.candidates
      .map((candidate) => computeFeasibilityReport(candidate, sceneSpec, evidence[candidate.id] || []))
      .sort((a, b) => b.feasibility_score - a.feasibility_score);

    emit({ type: 'agent_end', agent: 'Evidence & Ranking', message: 'Ranking complete.', data: reports });

    const result = { sceneSpec, candidates: discovery.candidates, evidence, reports };
    emit({ type: 'final_result', message: 'LokDrishti analysis complete.', data: result });
    return result;
  } catch (error) {
    emit({ type: 'error', message: error instanceof Error ? error.message : 'Unknown orchestrator error' });
    throw error;
  }
}
