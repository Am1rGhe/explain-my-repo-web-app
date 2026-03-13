// POST: add a message to a chat (user or assistant); chat must belong to current user
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id: chatId } = await params;
  if (!chatId) {
    return NextResponse.json({ error: "Chat id required" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { role, content } = body;
    if (!role || !content || !["user", "assistant"].includes(role)) {
      return NextResponse.json(
        { error: "role (user|assistant) and content are required" },
        { status: 400 }
      );
    }

    // make sure chat exists and belongs to this user
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userEmail: session.user.email },
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        role,
        content: String(content),
      },
    });

    return NextResponse.json({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 }
    );
  }
}
