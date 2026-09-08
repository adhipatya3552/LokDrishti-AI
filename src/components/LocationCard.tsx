import { AlertTriangle, CheckCircle2, ExternalLink, ShieldAlert } from 'lucide-react';
import { FeasibilityReport } from '@/lib/schemas';
import { formatEvidenceState, formatScoreColor } from '@/lib/utils';
import { CountUp } from '@/components/CountUp';

export function LocationCard({ report }: { report: FeasibilityReport }) {
  const score = formatScoreColor(report.feasibility_score);
  const statusLabel =
    report.recommendation_status === 'RECOMMENDED'
      ? 'Recommended'
      : report.recommendation_status === 'FEASIBLE_WITH_CONDITIONS'
        ? 'With conditions'
        : 'High risk';
  const StatusIcon =
    report.recommendation_status === 'RECOMMENDED'
      ? CheckCircle2
      : report.recommendation_status === 'FEASIBLE_WITH_CONDITIONS'
        ? AlertTriangle
        : ShieldAlert;

  return (
    <article className="glass-panel flex h-full flex-col rounded-2xl border border-ink-800 p-5 transition hover:border-amber-500/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash-500">Location candidate</p>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-ash-50">{report.candidate_name}</h3>
        </div>
        <div className={`score-glow rounded-full px-3 py-1.5 font-mono text-xs font-semibold ${score.bg} ${score.text}`}>
          <CountUp value={report.feasibility_score} />
          <span className="ml-1 text-[9px] uppercase opacity-70">/100</span>
        </div>
      </div>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-ink-700">
        <div
          className={`h-full ${report.feasibility_score >= 75 ? 'bg-emerald-500' : report.feasibility_score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
          style={{ width: `${report.feasibility_score}%` }}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <StatusIcon className={`h-4 w-4 ${score.text}`} />
        <span className={score.text}>{statusLabel}</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
        <Score label="Visual fit" value={report.score_breakdown.visual_match} max={30} />
        <Score label="Permit evidence" value={report.score_breakdown.permit_evidence} max={30} />
        <Score label="Access" value={report.score_breakdown.logistics_access} max={20} />
        <Score label="Risk" value={report.score_breakdown.risk_profile} max={20} />
      </div>

      <div className="mt-5 rounded-xl border border-ink-800 bg-ink-950/40 p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ash-500">Evidence states</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {Object.entries(report.evidence_state_summary).map(([key, count]) => {
            const pill = formatEvidenceState(key);
            return (
              <div key={key} className={`rounded-lg border px-2.5 py-2 ${pill.border} ${pill.bg}`}>
                <div className={`font-medium ${pill.text}`}>{count}</div>
                <div className="mt-1 text-[10px] leading-4 text-ash-400">{pill.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-ash-400">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-500">Sources</div>
          <div className="mt-1 text-ash-200">{report.total_source_count}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-500">Official sources</div>
          <div className="mt-1 text-ash-200">{report.official_source_count}</div>
        </div>
      </div>

      {report.coverage_gaps.length > 0 && (
        <div className="mt-5 rounded-xl border border-amber-900/40 bg-amber-950/20 p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-300">Coverage gaps</p>
          <ul className="mt-2 space-y-2 text-xs leading-5 text-ash-300">
            {report.coverage_gaps.slice(0, 4).map((gap, index) => (
              <li key={`${gap}-${index}`} className="flex gap-2">
                <span className="text-amber-400">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.risk_warnings.length > 0 && (
        <div className="mt-5 rounded-xl border border-rose-900/40 bg-rose-950/20 p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-rose-300">Research flags</p>
          <ul className="mt-2 space-y-2 text-xs leading-5 text-ash-300">
            {report.risk_warnings.slice(0, 3).map((warning, index) => (
              <li key={`${warning}-${index}`} className="flex gap-2">
                <span className="text-rose-400">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.insufficient_evidence_notice && (
        <p className="mt-4 text-xs leading-5 text-amber-300">{report.insufficient_evidence_notice}</p>
      )}

      <div className="mt-auto pt-5">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ash-500">
          Evidence trail · {report.evidence_items.length} items
        </p>
        {report.evidence_items.slice(0, 3).map((item) => {
          const badge = formatEvidenceState(item.evidence_state);
          return (
            <a
              key={item.id}
              href={item.source_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mb-3 block rounded-lg border border-ink-800 bg-ink-950/40 p-3 text-xs leading-5 text-ash-300 hover:border-amber-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="line-clamp-2 font-medium text-ash-100">{item.source_title}</span>
                <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
              </div>
              <div className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] ${badge.border} ${badge.bg} ${badge.text}`}>
                {badge.label}
              </div>
              <p className="mt-2 line-clamp-3 text-ash-400">{item.evidence_excerpt}</p>
              {item.published_date && <p className="mt-2 text-[10px] text-ash-500">Published: {item.published_date}</p>}
            </a>
          );
        })}
      </div>
    </article>
  );
}

function Score({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className="rounded-lg bg-ink-900/70 p-2.5">
      <div className="flex justify-between gap-2 text-ash-400">
        <span>{label}</span>
        <span className="font-mono text-ash-200">{value}/{max}</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-ink-700">
        <div className="h-full rounded-full bg-teal-500" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}
