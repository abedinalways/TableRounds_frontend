import { NextRequest, NextResponse } from 'next/server';

// Abort the upstream n8n request after this many ms so the client doesn't hang.
const N8N_TIMEOUT_MS = 30_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatInput, sessionId } = body;

    if (!chatInput || typeof chatInput !== 'string') {
      return NextResponse.json(
        { error: 'chatInput is required and must be a string' },
        { status: 400 },
      );
    }

    const webhookUrl = process.env.N8N_CHATBOT_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Chatbot is not configured. Set N8N_CHATBOT_URL in .env' },
        { status: 500 },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), N8N_TIMEOUT_MS);

    let n8nResponse: Response;
    try {
      n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput,
          sessionId: sessionId || `chatbot-${Date.now()}`,
        }),
        signal: controller.signal,
      });
    } catch (fetchError) {
      // fetch throws on network failure (n8n not running) or abort (timeout)
      const isTimeout =
        fetchError instanceof DOMException &&
        fetchError.name === 'AbortError';
      console.error('n8n chatbot fetch error:', fetchError);

      return NextResponse.json(
        {
          error: isTimeout
            ? 'The chatbot service took too long to respond. Please try again.'
            : 'The chatbot service is not reachable. Make sure n8n is running and the workflow is active.',
        },
        { status: 502 },
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!n8nResponse.ok) {
      const text = await n8nResponse.text();
      console.error('n8n chatbot error:', n8nResponse.status, text);

      if (n8nResponse.status === 404) {
        return NextResponse.json(
          {
            error:
              'The chatbot workflow is not active. Please activate the n8n workflow (toggle it on in the top-right of the n8n editor), or click "Execute workflow" if you are using the test URL.',
          },
          { status: 502 },
        );
      }

      return NextResponse.json(
        {
          error: `n8n error (${n8nResponse.status}): ${text || 'Unknown error'}`,
        },
        { status: n8nResponse.status },
      );
    }

    // n8n chat trigger can return JSON or plain text — handle both
    const contentType = n8nResponse.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await n8nResponse.json();

      // Normalize different possible response shapes
      let reply = '';
      if (typeof data === 'string') {
        reply = data;
      } else if (typeof data?.output === 'string') {
        reply = data.output;
      } else if (typeof data?.text === 'string') {
        reply = data.text;
      } else if (typeof data?.message === 'string') {
        reply = data.message;
      } else if (Array.isArray(data) && data.length > 0) {
        // n8n sometimes returns an array of items
        const first = data[0];
        reply =
          typeof first === 'string'
            ? first
            : first?.output || first?.text || first?.json?.output || '';
      } else {
        reply = JSON.stringify(data);
      }

      return NextResponse.json({ reply });
    }

    // Plain text response
    const text = await n8nResponse.text();
    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('Chatbot proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}