import { EvidenceCategory, EvidenceItem, EvidenceState, SourceAuthority, SupportLevel } from '@/lib/schemas';
import { NormalizedSearchResult } from '@/lib/parallel-search';

const REPUTABLE_NEWS_DOMAINS = [
  'thehindu.com',
  'indianexpress.com',
  'timesofindia.indiatimes.com',
  'hindustantimes.com',
  'ndtv.com',
  'deccanherald.com',
  'telegraphindia.com',
  'newindianexpress.com',
];

export function classifySourceAuthority(url: string): SourceAuthority {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (hostname.endsWith('.gov.in') || hostname.endsWith('.nic.in')) {
      return 'OFFICIAL_GOVERNMENT';
    }

    if (
      hostname.includes('asi') ||
      hostname.includes('tourism') ||
      hostname.includes('police') ||
      hostname.includes('municipal') ||
      hostname.includes('gov') ||
      hostname.includes('smartcity') ||
      hostname.includes('developmentauthority')
    ) {
      return 'GOVERNMENT_RELATED';
    }

    if (REPUTABLE_NEWS_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
      return 'REPUTABLE_NEWS';
    }

    if (hostname) {
      return 'GENERAL_WEBSITE';
    }
  } catch {
    return 'UNKNOWN';
  }

  return 'UNKNOWN';
}

export function computeEvidenceState({
  authority,
  supportLevel,
  contradictionCount,
}: {
  authority: SourceAuthority;
  supportLevel: SupportLevel;
  contradictionCount: number;
}): EvidenceState {
  if (contradictionCount > 0) {
    return 'CONFLICTING_EVIDENCE';
  }

  if (supportLevel === 'UNCLEAR') {
    return 'INSUFFICIENT_EVIDENCE';
  }

  if (authority === 'OFFICIAL_GOVERNMENT' && supportLevel === 'DIRECT') {
    return 'VERIFIED_EVIDENCE';
  }

  if (
    (authority === 'GOVERNMENT_RELATED' || authority === 'REPUTABLE_NEWS') &&
    (supportLevel === 'DIRECT' || supportLevel === 'INDIRECT')
  ) {
    return 'SUPPORTED_EVIDENCE';
  }

  return 'INSUFFICIENT_EVIDENCE';
}

export function buildEvidenceItem({
  id,
  category,
  claim,
  supportLevel,
  result,
  contradictionCount = 0,
}: {
  id: string;
  category: EvidenceCategory;
  claim: string;
  supportLevel: SupportLevel;
  result: NormalizedSearchResult;
  contradictionCount?: number;
}): EvidenceItem {
  const sourceAuthority = classifySourceAuthority(result.url);
  const evidence_state = computeEvidenceState({
    authority: sourceAuthority,
    supportLevel,
    contradictionCount,
  });

  return {
    id,
    claim,
    category,
    source_title: result.title,
    source_url: result.url,
    source_authority: sourceAuthority,
    snippet: result.snippet,
    evidence_excerpt: result.snippet,
    support_level: supportLevel,
    evidence_state,
    published_date: result.publishDate || null,
  };
}

export function summarizeEvidenceStates(items: EvidenceItem[]) {
  return {
    VERIFIED_EVIDENCE: items.filter((i) => i.evidence_state === 'VERIFIED_EVIDENCE').length,
    SUPPORTED_EVIDENCE: items.filter((i) => i.evidence_state === 'SUPPORTED_EVIDENCE').length,
    INSUFFICIENT_EVIDENCE: items.filter((i) => i.evidence_state === 'INSUFFICIENT_EVIDENCE').length,
    CONFLICTING_EVIDENCE: items.filter((i) => i.evidence_state === 'CONFLICTING_EVIDENCE').length,
  };
}
