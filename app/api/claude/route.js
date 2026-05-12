import { SYSTEMS } from "../../../lib/tools";

export async function POST(request) {
  try {
    const { tool, input } = await request.json();

    if (!input || !input.trim()) {
      return new Response(JSON.stringify({ error: "Input is empty." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not set in .env.local" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = SYSTEMS[tool] || SYSTEMS.agent;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.json();
      throw new Error(errBody?.error?.message || `Groq API error: ${groqRes.status}`);
    }

    const data = await groqRes.json();
    const text = data?.choices?.[0]?.message?.content || "No response received.";

    // Stream word by word for typing effect
    const words = text.split(" ");
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (const word of words) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text: word + " " })}\n\n`)
          );
          await new Promise((r) => setTimeout(r, 15));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
