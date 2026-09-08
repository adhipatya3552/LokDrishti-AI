'use client';

import { ArrowUpRight, Loader2, WandSparkles } from 'lucide-react';
import { useState } from 'react';

const examples = [
  {
    label: 'Monsoon market',
    text: 'A night-time chase through a crowded old-city market during heavy rain, with historic architecture and narrow streets.',
  },
  {
    label: 'Fort courtyard',
    text: 'At dusk, two rivals confront each other in a weathered fort courtyard with stone arches, room for a small crew, and a dramatic view over the landscape.',
  },
  {
    label: 'Riverside village',
    text: 'A quiet morning scene in a riverside village: boats, muddy paths, low homes, and enough access for a camera van and lighting truck.',
  },
];

export function SceneInput({
  onAnalyze,
  onCancel,
  isLoading,
}: {
  onAnalyze: (scene: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [scene, setScene] = useState(examples[0].text);

  return (
    <div className="glass-panel overflow-hidden rounded-2xl border border-ink-700/80 shadow-2xl shadow-black/20">
      <div className="border-b border-ink-800 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-amber-400">01 / Scene brief</p>
            <h2 className="mt-2 font-serif text-2xl text-ash-50">What needs to exist on screen?</h2>
          </div>
          <WandSparkles className="hidden h-5 w-5 text-amber-400 sm:block" />
        </div>
      </div>
      <div className="p-6">
        <label htmlFor="scene" className="sr-only">Scene description</label>
        <textarea
          id="scene"
          value={scene}
          onChange={(event) => setScene(event.target.value)}
          placeholder="Describe the scene as a director would..."
          className="min-h-36 w-full resize-y rounded-xl border border-ink-700 bg-ink-950/70 p-4 text-base leading-7 text-ash-100 outline-none transition placeholder:text-ash-500 focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/20"
          maxLength={5000}
        />
        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example.label}
                type="button"
                onClick={() => setScene(example.text)}
                className="rounded-full border border-ink-700 px-3 py-1.5 text-xs text-ash-300 transition hover:border-amber-500/60 hover:text-amber-300"
              >
                {example.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
          {isLoading && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-700 px-5 py-3 text-sm font-semibold text-ash-300 transition hover:border-rose-500/60 hover:text-rose-300"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            disabled={isLoading || !scene.trim()}
            onClick={() => onAnalyze(scene.trim())}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
            {isLoading ? 'Researching...' : 'Scout & analyze'}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
