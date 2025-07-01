import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "2");
    const skip = (page - 1) * limit;

    const [articles, count] = await Promise.all([
      prisma.article.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
        include: {
          user: true,
        },
      }),
      prisma.article.count(),
    ]);

    return NextResponse.json({
      message: "Fetched Successfully",
      articles,
      count
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
