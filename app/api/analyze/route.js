import { runAgents } from '../../../lib/orchestrator.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const journey = body.journey || 'report';

    const data = await runAgents(journey);

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
