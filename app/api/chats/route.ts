// GET: list current user's chats | POST: create a new chat
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// List chats for the signed-in user (by email)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: { userEmail: session.user.email },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, repoUrl: true, createdAt: true },
    });
    return NextResponse.json({ chats });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load chats" }, { status: 500 });
  }
}

// Create a new chat (repoUrl, title from first message)
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { repoUrl, title } = body;
    if (!repoUrl || !title) {
      return NextResponse.json(
        { error: "repoUrl and title are required" },
        { status: 400 }
      );
    }

    const chat = await prisma.chat.create({
      data: {
        userEmail: session.user.email,
        repoUrl: String(repoUrl).trim(),
        title: String(title).slice(0, 200),
      },
    });
    return NextResponse.json({
      id: chat.id,
      repoUrl: chat.repoUrl,
      title: chat.title,
      createdAt: chat.createdAt,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
