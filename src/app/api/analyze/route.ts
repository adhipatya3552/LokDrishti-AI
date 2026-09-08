import { NextRequest } from 'next/server';
import { runOrchestrator, OrchestratorEvent } from '@/lib/orchestrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET() {
  return Response.json({ status: 'ready', service: 'LokDrishti AI' });
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: OrchestratorEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        const body = await request.json();
        const sceneText = typeof body?.sceneText === 'string' ? body.sceneText.trim() : '';

        if (!sceneText) {
          send({ type: 'error', message: 'Enter a scene description to begin.', timestamp: Date.now() });
          return;
        }
        if (sceneText.length > 5000) {
          send({ type: 'error', message: 'Scene descriptions must be 5,000 characters or fewer.', timestamp: Date.now() });
          return;
        }

        await runOrchestrator(sceneText, send);
      } catch (error) {
        send({
          type: 'error',
          message: error instanceof Error ? error.message : 'The analysis could not be completed.',
          timestamp: Date.now(),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
