import { Check, CircleDot, ExternalLink, Loader2, Search, TriangleAlert } from 'lucide-react';
import { OrchestratorEvent } from '@/lib/orchestrator';

export function AgentTimeline({ events, isLoading }: { events: OrchestratorEvent[]; isLoading: boolean }) {
  const visibleEvents = events.filter((event) => event.type !== 'agent_end' || event.agent);

  return (
    <div className="glass-panel rounded-2xl border border-ink-800 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-teal-400">Live execution</p>
          <h2 className="mt-2 font-serif text-2xl text-ash-50">The research trail</h2>
        </div>
        {isLoading ? (
          <span className="live-dot inline-flex">
            <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
          </span>
        ) : (
          <Check className="h-5 w-5 text-emerald-400" />
        )}
      </div>
      <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
        {visibleEvents.map((event, index) => (
          <div
            key={`${event.timestamp}-${index}`}
            className="stagger-in rounded-xl border border-ink-800 bg-ink-950/50 p-3"
            style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
          >
            <div className="flex gap-3">
              <div className="mt-0.5 text-ash-500">
                {event.type === 'error' ? <TriangleAlert className="h-4 w-4 text-rose-400" /> : event.type.includes('parallel') ? <Search className="h-4 w-4 text-teal-400" /> : event.type === 'agent_end' ? <Check className="h-4 w-4 text-emerald-400" /> : <CircleDot className="h-4 w-4 text-amber-400" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-400">{event.agent || 'Orchestrator'}</span>
                  <span className="font-mono text-[10px] text-ash-500">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
                <p className={`mt-1 text-sm leading-6 ${event.type === 'error' ? 'text-rose-300' : 'text-ash-200'}`}>{event.message || 'Update'}</p>
                {event.query && <p className="mt-2 break-words border-l border-teal-500/50 pl-3 font-mono text-xs leading-5 text-teal-300">{event.query}</p>}
                {event.sources?.slice(0, 2).map((source, index) =>
                  source.url ? (
                    <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noreferrer noopener" className="mt-2 flex items-center gap-1 truncate text-xs text-amber-400 hover:text-amber-300">
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" /> {source.title || 'Source'}
                    </a>
                  ) : null
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
