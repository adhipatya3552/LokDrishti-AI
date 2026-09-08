export interface ParallelSearchResult {
  url: string;
  title: string;
  publish_date: string | null;
  excerpts: string[];
}

export interface ParallelSearchResponse {
  search_id: string;
  session_id?: string;
  warnings?: string[] | null;
  usage?: Array<{ name: string; count: number }>;
  results: ParallelSearchResult[];
}

export interface NormalizedSearchResult {
  title: string;
  url: string;
  snippet: string;
  publishDate?: string | null;
}

const PARALLEL_ENDPOINT = process.env.PARALLEL_API_URL || 'https://api.parallel.ai/v1/search';
const PARALLEL_TIMEOUT_MS = 20000;
const PARALLEL_MAX_RETRIES = 2;

export async function parallelSearch({
  objective,
  searchQueries,
  mode = 'advanced',
}: {
  objective: string;
  searchQueries: string[];
  mode?: 'advanced' | 'fast' | 'turbo';
}): Promise<ParallelSearchResponse> {
  const apiKey = process.env.PARALLEL_API_KEY;
  if (!apiKey) {
    throw new Error('PARALLEL_API_KEY is not configured.');
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= PARALLEL_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PARALLEL_TIMEOUT_MS);

    try {
      const response = await fetch(PARALLEL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          objective,
          search_queries: searchQueries,
          mode,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 429 && attempt < PARALLEL_MAX_RETRIES) {
        await sleep(500 * (attempt + 1));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Parallel Search API error (${response.status}): ${errorText}`);
      }

      return (await response.json()) as ParallelSearchResponse;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt >= PARALLEL_MAX_RETRIES) {
        break;
      }
      await sleep(500 * (attempt + 1));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Parallel Search failed.');
}

export function normalizeParallelResults(response: ParallelSearchResponse): NormalizedSearchResult[] {
  return (response.results || []).map((result) => ({
    title: result.title,
    url: result.url,
    snippet: result.excerpts?.join(' ').trim() || '',
    publishDate: result.publish_date,
  }));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
