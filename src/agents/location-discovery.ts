import { generateStructuredJson } from '@/lib/google-gemini';
import {
  LOCATION_CANDIDATES_SCHEMA,
  LocationCandidate,
  SceneSpec,
} from '@/lib/schemas';
import { normalizeParallelResults, parallelSearch } from '@/lib/parallel-search';

interface CandidateDraft {
  name: string;
  district: string;
  state: string;
  description: string;
  visual_match_reasoning: string;
}

export interface DiscoveryTrace {
  queries: string[];
}

export async function locationDiscoveryAgent(
  sceneSpec: SceneSpec
): Promise<{ candidates: LocationCandidate[]; trace: DiscoveryTrace }> {
  const queries = buildDiscoveryQueries(sceneSpec);
  const response = await parallelSearch({
    objective:
      'Find real Indian filming locations that visually match the scene and are plausible candidates for production scouting.',
    searchQueries: queries,
    mode: 'advanced',
  });

  const normalized = normalizeParallelResults(response).slice(0, 12);

  const prompt = [
    'Scene requirements:',
    JSON.stringify(sceneSpec, null, 2),
    '',
    'Search results:',
    JSON.stringify(normalized, null, 2),
    '',
    'Select the 3 strongest distinct Indian location candidates only if supported by these results.',
    'Prefer the most specific real place name the results support (monument, street, market, ghat, studio, valley, neighborhood) over a whole city.',
    'Only return a whole city as a candidate if the scene genuinely needs a city-scale area.',
    'Do not invent source facts. Use only evidence present in the results.',
  ].join('\n');

  const structured = await generateStructuredJson<{ candidates: CandidateDraft[] }>({
    systemInstruction:
      'You are LokDrishti\'s Location Discovery Agent. Choose up to 3 strong Indian location candidates from the provided search evidence. Only return candidates grounded in the supplied results. Prefer specific named sites over whole cities.',
    userPrompt: prompt,
    jsonSchema: LOCATION_CANDIDATES_SCHEMA,
  });

  const candidates = structured.candidates
    .slice(0, 3)
    .map((candidate, index) => ({
      id: `candidate-${index + 1}-${slugify(candidate.name)}`,
      ...candidate,
      discovery_sources: normalized
        .filter((result) => {
          const haystack = `${result.title} ${result.snippet}`.toLowerCase();
          const nameTokens = candidate.name
            .toLowerCase()
            .replace(/\(.*?\)/g, ' ')
            .split(/[^a-z0-9]+/)
            .filter((part) => part.length > 2);
          return nameTokens.length > 0 && nameTokens.every((part) => haystack.includes(part));
        })
        .slice(0, 3)
        .map((result) => ({
          title: result.title,
          url: result.url,
          snippet: result.snippet,
        })),
    }))
    .filter((candidate) => candidate.discovery_sources.length > 0);

  return { candidates, trace: { queries } };
}

function cleanToken(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (/^(null|undefined|none|n\/a|nil)$/i.test(trimmed)) return '';
  return trimmed;
}

function buildDiscoveryQueries(sceneSpec: SceneSpec): string[] {
  const base = sceneSpec.search_keywords.map(cleanToken).filter((part) => part.length > 0).join(' ');
  const regional = cleanToken(sceneSpec.regional_preference) || cleanToken(sceneSpec.geography_preference) || 'India';
  const architectural = cleanToken(sceneSpec.architectural_style);
  const weather = cleanToken(sceneSpec.weather_element);
  const queries = [
    `${base} filming location ${regional}`,
    `${sceneSpec.setting_type.replaceAll('_', ' ')} India filming location`,
    `${architectural} ${sceneSpec.setting_type.replaceAll('_', ' ')} India`,
    `${sceneSpec.time_of_day} ${weather} ${sceneSpec.setting_type.replaceAll('_', ' ')} India`,
  ];

  return Array.from(new Set(queries.map((q) => q.replace(/\s+/g, ' ').trim()).filter(Boolean)));
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
