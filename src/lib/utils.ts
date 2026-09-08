import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreColor(score: number): { text: string; ring: string; bg: string } {
  if (score >= 75) {
    return { text: 'text-emerald-400', ring: 'stroke-emerald-500', bg: 'bg-emerald-950/30' };
  }
  if (score >= 50) {
    return { text: 'text-amber-400', ring: 'stroke-amber-500', bg: 'bg-amber-950/30' };
  }
  return { text: 'text-rose-400', ring: 'stroke-rose-500', bg: 'bg-rose-950/30' };
}

export function formatEvidenceState(state: string): { label: string; bg: string; text: string; border: string } {
  switch (state) {
    case 'VERIFIED_EVIDENCE':
      return {
        label: 'Verified evidence',
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-300',
        border: 'border-emerald-700/50',
      };
    case 'SUPPORTED_EVIDENCE':
      return {
        label: 'Supported evidence',
        bg: 'bg-teal-950/40',
        text: 'text-teal-300',
        border: 'border-teal-700/50',
      };
    case 'CONFLICTING_EVIDENCE':
      return {
        label: 'Conflicting evidence',
        bg: 'bg-amber-950/40',
        text: 'text-amber-300',
        border: 'border-amber-700/50',
      };
    case 'INSUFFICIENT_EVIDENCE':
    default:
      return {
        label: 'Insufficient evidence',
        bg: 'bg-rose-950/40',
        text: 'text-rose-300',
        border: 'border-rose-700/50',
      };
  }
}
