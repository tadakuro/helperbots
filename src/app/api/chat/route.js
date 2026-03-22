import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages, systemPrompt, model, apiKey } = await request.json();

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required." },
        { status: 400 }
      );
    }

    if (!systemPrompt || typeof systemPrompt !== "string") {
      return NextResponse.json(
        { error: "systemPrompt is required." },
        { status: 400 }
      );
    }

    if (!apiKey || typeof apiKey !== "string" || !apiKey.startsWith("sk-")) {
      return NextResponse.json(
        { error: "A valid OpenAI API key is required." },
        { status: 401 }
      );
    }

    // Allowed models whitelist — prevents arbitrary model injection
    const allowedModels = ["gpt-5.4-mini", "gpt-5.4-nano"];
    const selectedModel = allowedModels.includes(model) ? model : "gpt-5.4-mini";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: 200,
        temperature: 0.9,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: errorData?.error?.message || "OpenAI request failed." },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
