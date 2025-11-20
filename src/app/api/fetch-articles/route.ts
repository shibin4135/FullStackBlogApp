import {  NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const GET = async () => {
  try {
    // Try to fetch with isDraft filter, fallback if field doesn't exist
    let articles;
    try {
      articles = await prisma.article.findMany({
        where: {
          isDraft: false,
        },
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
      });
    } catch (error: any) {
      // If isDraft field doesn't exist, fetch all articles
      if (error?.message?.includes('Unknown argument') || error?.message?.includes('isDraft')) {
        articles = await prisma.article.findMany({
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
        });
      } else {
        throw error;
      }
    }
    if (!articles) {
      return NextResponse.json({
        message: "No articles Found",
      });
    }
    return NextResponse.json({
      articles,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};
