import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const POST = async () => {
  try {
    const data = await currentUser();
    const fname = data?.firstName;
    const lname = data?.lastName;
    const name = `${fname} ${lname}`;
    const imageUrl = data?.imageUrl;

    const newUser = await prisma.user.create({
      data: {
        name,
        email: data?.emailAddresses[0]?.emailAddress!,
        clerkUserId: data?.id as string,
        imageUrl,
      },
    });
    return NextResponse.json({
      newUser,
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
