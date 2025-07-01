import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const formdata = await req.formData();
    const userId = formdata.get("userId") as string;
    const postId = formdata.get("articleId") as string;

    if (!userId || !postId) {
      return NextResponse.json({
        message: "Missing credentials",
      });
    }
    // Find the user with that userId
    const user = await prisma.user.findFirst({
      where: {
        clerkUserId: userId,
      },
    });

    // Check already liked if it is remove the record

    const alreadyLiked = await prisma.like.findFirst({
      where: {
        articleid: postId,
        userid: user?.id,
      },
    });

    if (alreadyLiked) {
      await prisma.like.delete({
        where: {
          userid_articleid: {
            userid: user?.id as string,
            articleid: postId,
          },
        },
      });
      return NextResponse.json({
        liked: true,
      });
    }

    // create

    await prisma.like.create({
      data: {
        userid: user?.id as string,
        articleid: postId,
      },
    });

    return NextResponse.json({
      message: "Post Liked Successfully",
      liked: false,
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
