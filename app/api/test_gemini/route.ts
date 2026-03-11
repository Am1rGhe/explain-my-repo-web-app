import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  const aiKey = process.env.GEMINI_API_KEY;

  if (!aiKey) {
    return NextResponse.json({ error: "Missing gemin api" }, { status: 500 });
  }

  const genAi = new GoogleGenerativeAI(aiKey);
  const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent(
      "hey my name is amir how good are you in coding?"
    );
    const text = result.response.text();
    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const message = err && typeof err === "object" && "status" in err && err.status === 429
      ? "Gemini rate limit (429). Wait a minute or try again later."
      : err instanceof Error ? err.message : "Gemini request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
