import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async (req: NextRequest) => {
  try {
    const session = await currentUser();
    if (!session?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { clerkUserId: session.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "overview";

    if (type === "overview") {
      // Overall statistics
      const totalArticles = await prisma.article.count({
        where: { userid: user.id, isDraft: false },
      });

      const totalViews = await prisma.article.aggregate({
        where: { userid: user.id, isDraft: false },
        _sum: { views: true },
      });

      const totalLikes = await prisma.like.count({
        where: {
          article: {
            userid: user.id,
            isDraft: false,
          },
        },
      });

      const totalComments = await prisma.comment.count({
        where: {
          article: {
            userid: user.id,
            isDraft: false,
          },
        },
      });

      // Recent articles performance
      const recentArticles = await prisma.article.findMany({
        where: { userid: user.id, isDraft: false },
        take: 5,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          coverPic: true,
          views: true,
          created_at: true,
          _count: {
            select: {
              likes: true,
              comments: true,
              bookmarks: true,
            },
          },
        },
      });

      return NextResponse.json({
        overview: {
          totalArticles,
          totalViews: totalViews._sum.views || 0,
          totalLikes,
          totalComments,
        },
        recentArticles,
      });
    }

    if (type === "trending") {
      // Trending articles (last 7 days, sorted by engagement)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const trendingArticles = await prisma.article.findMany({
        where: {
          isDraft: false,
          created_at: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          id: true,
          title: true,
          coverPic: true,
          views: true,
          created_at: true,
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
        take: 10,
      });

      return NextResponse.json({
        trendingArticles: trendingArticles.map((article) => ({
          ...article,
          engagementScore:
            article.views * 1 +
            article._count.likes * 5 +
            article._count.comments * 3 +
            article._count.bookmarks * 2,
        })),
      });
    }

    return NextResponse.json(
      { message: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

