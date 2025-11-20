import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("articleId");
    const category = searchParams.get("category");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

    if (!articleId) {
      return NextResponse.json(
        { success: false, message: "Article ID is required" },
        { status: 400 }
      );
    }

    // Build query for related articles
    type WhereClause = {
      id: { not: string };
      isDraft?: boolean;
      OR?: Array<{ category?: string; tags?: { hasSome: string[] } }>;
    };
    const whereClause: WhereClause = {
      id: { not: articleId },
      isDraft: false,
      OR: [],
    };

    // Add category match
    if (category && whereClause.OR) {
      whereClause.OR.push({ category });
    }

    // Add tag matches
    if (tags.length > 0 && whereClause.OR) {
      whereClause.OR.push({
        tags: {
          hasSome: tags,
        },
      });
    }

    // If no OR conditions, use a fallback
    if (whereClause.OR && whereClause.OR.length === 0) {
      delete whereClause.OR;
    }

    const relatedArticles = await prisma.article.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
      orderBy: [
        { views: "desc" },
        { created_at: "desc" },
      ],
      take: 6,
    });

    return NextResponse.json({
      success: true,
      articles: relatedArticles,
    });
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
};

