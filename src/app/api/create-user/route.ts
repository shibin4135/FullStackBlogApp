import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const POST = async () => {
  try {
    const data = await currentUser();
    if (!data) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const fname = data?.firstName || "";
    const lname = data?.lastName || "";
    const name = `${fname} ${lname}`.trim() || data?.username || "User";
    const imageUrl = data?.imageUrl;
    const userId = data?.id as string;
    const email = data?.emailAddresses[0]?.emailAddress as string;

    if (!email || !userId) {
      return NextResponse.json(
        { message: "Missing user information" },
        { status: 400 }
      );
    }

    // Use upsert to handle existing users gracefully
    const user = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        name,
        imageUrl,
        clerkUserId: userId,
      },
      create: {
        name,
        email,
        clerkUserId: userId,
        imageUrl,
      },
    });

    return NextResponse.json({
      user,
      created: true,
    });
  } catch (error: unknown) {
    console.error("Error creating/updating user:", error);
    
    // If it's a unique constraint error, user already exists - that's okay
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      // Try to find existing user
      try {
        const data = await currentUser();
        const email = data?.emailAddresses[0]?.emailAddress as string;
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser) {
          return NextResponse.json({
            user: existingUser,
            created: false,
          });
        }
      } catch {
        // Ignore find errors
      }
    }

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
