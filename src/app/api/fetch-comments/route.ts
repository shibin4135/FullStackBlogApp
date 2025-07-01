import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export const POST = async (req: NextRequest) => {
  const {articleId} = await req.json();
  try {
    const comments = await prisma.comment.findMany({
      where: {
        articleid: articleId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    if (!comments) {
      return NextResponse.json({
        message: "No comments found",
      });
    }
    return NextResponse.json({
      comments,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
};
