// src/app/layout.tsx

import './globals.css';
import { Inter, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata = {
  title: 'LokDrishti AI | Evidence-Grounded Location Intelligence',
  description:
    'Agentic pre-production intelligence for Indian film production: transforms creative scenes into evidence-backed location feasibility briefs.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${inter.variable} ${cormorant.variable} ${jetBrainsMono.variable} antialiased text-ash-100 bg-ink-950 min-h-screen`}
      >
        <div className="pointer-events-none fixed inset-0 bg-film-grain bg-[length:200px] opacity-[0.035]" />
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1 container mx-auto max-w-7xl px-4 pt-16 pb-24">{children}</main>
          <footer className="border-t border-ink-800 py-6 mt-auto">
            <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-ash-400">
              <p>
                LokDrishti AI provides AI-generated production research, not legal advice or
                official permit approval. Final permissions must be confirmed with the relevant
                authorities.{' '}
                Built for the{' '}
                <a
                  href="https://agentic-cinema.devpost.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-400 transition-colors"
                >
                  Agentic Cinema Hackathon
                </a>
                .
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
