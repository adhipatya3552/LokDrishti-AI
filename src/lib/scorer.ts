import {
  EvidenceItem,
  EvidenceState,
  FeasibilityReport,
  LocationCandidate,
  SceneSpec,
  SourceAuthority,
  RecommendationStatus,
} from '@/lib/schemas';
import { summarizeEvidenceStates } from '@/lib/evidence';

const WEIGHTS = {
  VISUAL_MATCH: 30,
  PERMIT_EVIDENCE: 30,
  LOGISTICS_ACCESS: 20,
  RISK_PROFILE: 20,
} as const;

function sourceAuthorityWeight(sourceAuthority: SourceAuthority): number {
  switch (sourceAuthority) {
    case 'OFFICIAL_GOVERNMENT':
      return 1;
    case 'GOVERNMENT_RELATED':
      return 0.85;
    case 'REPUTABLE_NEWS':
      return 0.65;
    case 'GENERAL_WEBSITE':
      return 0.35;
    case 'UNKNOWN':
    default:
      return 0.2;
  }
}

function evidenceStateWeight(evidenceState: EvidenceState): number {
  switch (evidenceState) {
    case 'VERIFIED_EVIDENCE':
      return 1;
    case 'SUPPORTED_EVIDENCE':
      return 0.65;
    case 'CONFLICTING_EVIDENCE':
      return 0.25;
    case 'INSUFFICIENT_EVIDENCE':
    default:
      return 0.05;
  }
}

export function calculateVisualMatchScore(candidate: LocationCandidate): number {
  const baseScore = 14;
  const reasoningBonus = Math.min(10, Math.round((candidate.visual_match_reasoning?.length || 0) / 24));
  const sourceBonus = Math.min(6, candidate.discovery_sources.length * 2);
  return Math.min(WEIGHTS.VISUAL_MATCH, baseScore + reasoningBonus + sourceBonus);
}

export function calculatePermitEvidenceScore(evidenceItems: EvidenceItem[]): number {
  const relevant = evidenceItems.filter(
    (item) =>
      item.category === 'permit_rules' ||
      item.category === 'municipal_noc' ||
      item.category === 'night_shooting_rules' ||
      item.category === 'heritage_restriction' ||
      item.category === 'drone_restrictions'
  );

  if (relevant.length === 0) {
    return 0;
  }

  const weightedAverage =
    relevant.reduce((sum, item) => sum + sourceAuthorityWeight(item.source_authority) * evidenceStateWeight(item.evidence_state), 0) /
    relevant.length;

  return Math.max(0, Math.min(WEIGHTS.PERMIT_EVIDENCE, Math.round(weightedAverage * WEIGHTS.PERMIT_EVIDENCE)));
}

export function calculateLogisticsScore(evidenceItems: EvidenceItem[]): number {
  const relevant = evidenceItems.filter(
    (item) => item.category === 'access_logistics' || item.category === 'recent_news'
  );

  if (relevant.length === 0) {
    return 2;
  }

  const weightedAverage =
    relevant.reduce((sum, item) => sum + sourceAuthorityWeight(item.source_authority) * evidenceStateWeight(item.evidence_state), 0) /
    relevant.length;

  return Math.max(0, Math.min(WEIGHTS.LOGISTICS_ACCESS, Math.round(weightedAverage * WEIGHTS.LOGISTICS_ACCESS)));
}

export function calculateRiskProfileScore(evidenceItems: EvidenceItem[], sceneSpec: SceneSpec): number {
  let score = WEIGHTS.RISK_PROFILE;

  for (const item of evidenceItems) {
    const severity = sourceAuthorityWeight(item.source_authority) * evidenceStateWeight(item.evidence_state);
    const claim = item.claim.toLowerCase();

    if (claim.includes('prohibit') || claim.includes('banned') || claim.includes('not allowed')) {
      score -= 8 * severity;
    } else if (claim.includes('restrict') || claim.includes('approval') || claim.includes('noc')) {
      score -= 3 * severity;
    }

    if (item.evidence_state === 'CONFLICTING_EVIDENCE') {
      score -= 3;
    }
  }

  if (sceneSpec.special_requirements.night_shoot && !evidenceItems.some((i) => i.category === 'night_shooting_rules')) {
    score -= 4;
  }
  if (sceneSpec.special_requirements.heritage_risk && !evidenceItems.some((i) => i.category === 'heritage_restriction')) {
    score -= 4;
  }
  if (sceneSpec.special_requirements.drone_required && !evidenceItems.some((i) => i.category === 'drone_restrictions')) {
    score -= 3;
  }

  return Math.max(0, Math.min(WEIGHTS.RISK_PROFILE, Math.round(score)));
}

export function determineRecommendationStatus(totalScore: number, evidenceItems: EvidenceItem[]): RecommendationStatus {
  const hasBlockingEvidence = evidenceItems.some(
    (item) =>
      item.evidence_state !== 'INSUFFICIENT_EVIDENCE' &&
      /prohibit|banned|not allowed/i.test(item.claim)
  );

  if (hasBlockingEvidence) {
    return 'HIGH_RISK_NOT_RECOMMENDED';
  }
  if (totalScore >= 72) {
    return 'RECOMMENDED';
  }
  if (totalScore >= 48) {
    return 'FEASIBLE_WITH_CONDITIONS';
  }
  return 'HIGH_RISK_NOT_RECOMMENDED';
}

export function generateRiskWarnings(evidenceItems: EvidenceItem[]): string[] {
  return evidenceItems
    .filter(
      (item) =>
        item.evidence_state === 'CONFLICTING_EVIDENCE' ||
        /prohibit|banned|restrict|noc|approval|closure|construction/i.test(item.claim)
    )
    .slice(0, 6)
    .map((item) => `${item.claim} (${item.source_title})`);
}

export function extractPermitAuthorities(evidenceItems: EvidenceItem[]): string[] {
  const authorities = new Set<string>();
  for (const item of evidenceItems) {
    const title = item.source_title.toLowerCase();
    const url = item.source_url.toLowerCase();
    if (title.includes('asi') || url.includes('asi')) authorities.add('ASI');
    if (title.includes('municipal') || url.includes('municipal')) authorities.add('Municipal Corporation');
    if (title.includes('police') || url.includes('police')) authorities.add('Police');
    if (title.includes('collector') || title.includes('district')) authorities.add('District Administration');
    if (title.includes('tourism') || url.includes('tourism')) authorities.add('Tourism Department');
  }
  return Array.from(authorities);
}

export function findCoverageGaps(evidenceItems: EvidenceItem[], sceneSpec: SceneSpec): string[] {
  const gaps: string[] = [];
  const hasCategory = (category: EvidenceItem['category']) => evidenceItems.some((item) => item.category === category);

  if (!hasCategory('permit_rules')) gaps.push('No reliable permit evidence found.');
  if (!hasCategory('municipal_noc')) gaps.push('No reliable municipal NOC evidence found.');
  if (sceneSpec.special_requirements.night_shoot && !hasCategory('night_shooting_rules')) gaps.push('Night-shooting evidence missing.');
  if (sceneSpec.special_requirements.heritage_risk && !hasCategory('heritage_restriction')) gaps.push('Heritage restriction evidence missing.');
  if (sceneSpec.special_requirements.drone_required && !hasCategory('drone_restrictions')) gaps.push('Drone restriction evidence missing.');
  return gaps;
}

export function checkInsufficientEvidence(evidenceItems: EvidenceItem[], sceneSpec: SceneSpec): string | undefined {
  const gaps = findCoverageGaps(evidenceItems, sceneSpec);
  if (gaps.length === 0) {
    return undefined;
  }
  return `Insufficient evidence — authority confirmation required. ${gaps.join(' ')}`;
}

const CRITICAL_DIMENSIONS: Array<{
  required: (sceneSpec: SceneSpec) => boolean;
  category: EvidenceItem['category'];
  label: string;
}> = [
  {
    required: (sceneSpec) => sceneSpec.special_requirements.night_shoot,
    category: 'night_shooting_rules',
    label: 'night-shooting',
  },
  {
    required: (sceneSpec) => sceneSpec.special_requirements.heritage_risk,
    category: 'heritage_restriction',
    label: 'heritage-restriction',
  },
  {
    required: (sceneSpec) => sceneSpec.special_requirements.drone_required,
    category: 'drone_restrictions',
    label: 'drone-restriction',
  },
];

export function findCriticalEvidenceGaps(evidenceItems: EvidenceItem[], sceneSpec: SceneSpec): string[] {
  return CRITICAL_DIMENSIONS.filter(
    ({ required, category }) =>
      required(sceneSpec) &&
      !evidenceItems.some(
        (item) =>
          item.category === category &&
          (item.evidence_state === 'VERIFIED_EVIDENCE' || item.evidence_state === 'SUPPORTED_EVIDENCE')
      )
  ).map(({ label }) => `Best available — no meaningful ${label} evidence, so this is not marked RECOMMENDED.`);
}

export function computeFeasibilityReport(
  candidate: LocationCandidate,
  sceneSpec: SceneSpec,
  evidenceItems: EvidenceItem[]
): FeasibilityReport {
  const visual_match = calculateVisualMatchScore(candidate);
  const permit_evidence = calculatePermitEvidenceScore(evidenceItems);
  const logistics_access = calculateLogisticsScore(evidenceItems);
  const risk_profile = calculateRiskProfileScore(evidenceItems, sceneSpec);
  const feasibility_score = visual_match + permit_evidence + logistics_access + risk_profile;
  const evidence_state_summary = summarizeEvidenceStates(evidenceItems);
  const criticalGaps = findCriticalEvidenceGaps(evidenceItems, sceneSpec);
  const baseStatus = determineRecommendationStatus(feasibility_score, evidenceItems);
  const recommendation_status =
    baseStatus === 'RECOMMENDED' && criticalGaps.length > 0 ? 'FEASIBLE_WITH_CONDITIONS' : baseStatus;

  return {
    candidate_id: candidate.id,
    candidate_name: candidate.name,
    feasibility_score,
    score_breakdown: {
      visual_match,
      permit_evidence,
      logistics_access,
      risk_profile,
    },
    total_source_count: evidenceItems.length,
    official_source_count: evidenceItems.filter((item) => item.source_authority === 'OFFICIAL_GOVERNMENT').length,
    evidence_state_summary,
    evidence_items: evidenceItems,
    coverage_gaps: [...criticalGaps, ...findCoverageGaps(evidenceItems, sceneSpec)],
    risk_warnings: generateRiskWarnings(evidenceItems),
    key_permit_authorities: extractPermitAuthorities(evidenceItems),
    recommendation_status,
    insufficient_evidence_notice: checkInsufficientEvidence(evidenceItems, sceneSpec),
  };
}
