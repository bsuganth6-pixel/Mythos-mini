import { SYSTEMS } from "../../../lib/tools";

export async function POST(request) {
  try {
    const { tool, input, files } = await request.json();

    if (!input?.trim() && (!files || files.length === 0)) {
      return new Response(JSON.stringify({ error: "Input is empty." }), {
        status: 400, headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GROQ_API_KEY not set in .env.local" }), {
        status: 500, headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = SYSTEMS[tool] || SYSTEMS.agent;

    // Build user message — include file contents if uploaded
    let userMessage = input || "";
    if (files && files.length > 0) {
      userMessage += "\n\n--- UPLOADED FILES ---\n";
      files.forEach((f) => {
        userMessage += `\nFile: ${f.name}\n\`\`\`\n${f.content}\n\`\`\`\n`;
      });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2000,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.json();
      throw new Error(errBody?.error?.message || `Groq API error: ${groqRes.status}`);
    }

    const data = await groqRes.json();
    const text = data?.choices?.[0]?.message?.content || "No response received.";

    const words = text.split(" ");
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (const word of words) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: word + " " })}\n\n`));
          await new Promise((r) => setTimeout(r, 12));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Server error" }), {
      status: 500, headers: { "Content-Type": "application/json" },
    });
  }
}
