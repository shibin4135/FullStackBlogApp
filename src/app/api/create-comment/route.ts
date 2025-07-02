import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
  try {
    const formdata = await req.formData();
    const articleid = formdata.get("articleId") as string;
    const comment = formdata.get("comment") as string;
    const session = await currentUser();

    const User = await prisma.user.findFirst({
      where: {
        clerkUserId: session?.id,
      },
    });

    if (!User || !User.id) {
      return NextResponse.json({
        message: "No user found",
      });
    }

    const newcomment = await prisma.comment.create({
      data: {
        comment,
        userid: User?.id,
        articleid,
        parentId: null,
      },
    });
    return NextResponse.json({
      newcomment,
    });
  } catch {
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
