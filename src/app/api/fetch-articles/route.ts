import {  NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const GET = async () => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageUrl:true
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
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
