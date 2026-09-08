'use client';

import { ShieldCheck } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="rounded-xl border border-ink-800 bg-ink-900/50 p-4">
      <div className="flex gap-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-ash-500" />
        <p className="text-xs leading-6 text-ash-400">
          <strong className="text-ash-200">Legal Notice:</strong> LokDrishti AI provides AI-generated production research based on live web evidence. It does not provide legal advice, official permit approvals, or guarantee that filming is permitted at any specific location. All regulations, fees, and procedures must be verified directly with the Archaeological Survey of India (ASI), local municipal corporations, police departments, and other relevant authorities before production begins.
        </p>
      </div>
    </div>
  );
}
