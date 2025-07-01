import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get("searchTerm") as string;

    const articles = await prisma.article.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      include: {
        user: true,
      },
    });

    if (!articles) {
      return NextResponse.json({
        message: "No Articles found",
      });
    }

    return NextResponse.json({
      success: true,
      articles,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server Error",
    });
  }
};
