import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("searchTerm") as string;
    const category = searchParams.get("category") as string | null;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

    if (!searchTerm || searchTerm.trim() === "") {
      return NextResponse.json({
        success: true,
        articles: [],
      });
    }

    // Build where clause for full-text search
    const whereClause: any = {
      isDraft: false,
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    };

    // Add category filter if provided
    if (category) {
      whereClause.category = category;
    }

    // Add tags filter if provided
    if (tags.length > 0) {
      whereClause.tags = {
        hasSome: tags,
      };
    }

    const articles = await prisma.article.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
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
      orderBy: {
        created_at: "desc",
      },
      take: 50, // Limit results
    });

    // Highlight search terms in results
    const highlightedArticles = articles.map((article) => {
      const highlightText = (text: string, term: string) => {
        const regex = new RegExp(`(${term})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
      };

      return {
        ...article,
        title: highlightText(article.title.replace(/<[^>]*>/g, ""), searchTerm),
        content: highlightText(
          article.content.replace(/<[^>]*>/g, "").substring(0, 200),
          searchTerm
        ),
      };
    });

    return NextResponse.json({
      success: true,
      articles: highlightedArticles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
};
