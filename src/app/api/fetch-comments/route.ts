import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// Type for comment with nested replies
type CommentWithReplies = {
  id: string;
  comment: string;
  userid: string;
  articleid: string;
  parentId: string | null;
  created_at: Date;
  updated_at: Date;
  user: {
    name: string;
    email: string;
    imageUrl: string | null;
  };
  replies: CommentWithReplies[];
};

// Helper function to recursively fetch replies
async function fetchReplies(parentId: string): Promise<CommentWithReplies[]> {
  const replies = await prisma.comment.findMany({
    where: {
      parentId: parentId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  // Recursively fetch nested replies
  const repliesWithNested = await Promise.all(
    replies.map(async (reply) => {
      const nestedReplies = await fetchReplies(reply.id);
      return {
        ...reply,
        replies: nestedReplies,
      };
    })
  );

  return repliesWithNested;
}

export const POST = async (req: NextRequest) => {
  const { articleId } = await req.json();
  try {
    // Fetch only top-level comments (where parentId is null)
    const topLevelComments = await prisma.comment.findMany({
      where: {
        articleid: articleId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // Fetch replies for each top-level comment
    const commentsWithReplies = await Promise.all(
      topLevelComments.map(async (comment) => {
        const replies = await fetchReplies(comment.id);
        return {
          ...comment,
          replies,
        };
      })
    );

    return NextResponse.json({
      comments: commentsWithReplies,
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
