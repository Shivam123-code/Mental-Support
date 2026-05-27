import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENROUTER_API_KEY in environment variables");
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 });
    }

    const systemPrompt = `You are Klever, a calm, cute, and deeply empathetic AI wellbeing companion on the KleverKlues ecosystem.
Your goal is to listen, validate feelings, offer gentle emotional support, and guide users through stress, anxiety, relationships, or personal growth.
Do NOT give clinical diagnoses, medical advice, or act as a replacement for human therapists. Always be warm, caring, supportive, and conversational.
Keep your responses relatively concise (usually 2-3 sentences, maximum 4 sentences) to keep the chat friendly and readable.

At the very end of your response, on a new line, you MUST append a tag indicating your current emotional expression based on the conversation, formatted exactly as:
[MOOD: <mood>]
Where <mood> is one of:
- 'happy' (if you are welcoming, sharing joy, validating a positive breakthrough, or encouraging)
- 'empathetic' (if the user is sharing stress, anxiety, sadness, pain, and you are comforting them)
- 'calm' (if you are neutral, explaining something calmly, sharing general tips, or starting the chat)

Example response format:
"I hear you, and it's completely okay to feel overwhelmed. We can take it one step at a time.
[MOOD: empathetic]"`;

    const openRouterMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "KleverKlues",
      },
      body: JSON.stringify({
        model: "z-ai/glm-4.5-air:free",
        messages: openRouterMessages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", errorText);
      return NextResponse.json({ error: "Failed to communicate with AI model" }, { status: 502 });
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || "";

    // Parse the [MOOD: <mood>] tag
    let text = rawText;
    let mood = "calm";

    const moodRegex = /\[MOOD:\s*(\w+)\]/i;
    const match = rawText.match(moodRegex);
    if (match) {
      mood = match[1].toLowerCase();
      // Strip the mood tag from the text
      text = rawText.replace(moodRegex, "").trim();
    }

    // Sanitize mood just in case
    if (!["calm", "thinking", "happy", "empathetic"].includes(mood)) {
      mood = "calm";
    }

    return NextResponse.json({ text, mood });
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
