import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const { articleId } = await req.json();

    if (!articleId) {
      return NextResponse.json(
        { success: false, message: "Article ID is required" },
        { status: 400 }
      );
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

