import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { repoUrl, question } = body;

  // check if the url or the question is missing
  if (!repoUrl || !question) {
    return NextResponse.json(
      { error: "Missing repoUrl or the question" },
      { status: 400 }
    );
  }
  return NextResponse.json({
    answer: "nothing is missing yet, still in progress....",
  });
}
