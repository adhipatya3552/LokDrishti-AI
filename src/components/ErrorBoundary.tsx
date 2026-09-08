'use client';

import { Component, ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';

export function ErrorBoundary({ children, label }: { children: ReactNode; label: string }) {
  return <Boundary label={label}>{children}</Boundary>;
}

interface State {
  failed: boolean;
}

class Boundary extends Component<{ children: ReactNode; label: string }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="rounded-2xl border border-rose-900/40 bg-rose-950/15 p-6">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
            <div>
              <h2 className="font-serif text-2xl text-ash-50">This {this.props.label} could not be displayed</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ash-300">
                The research data for this section was incomplete. The rest of the analysis below is unaffected — try running the analysis again.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
