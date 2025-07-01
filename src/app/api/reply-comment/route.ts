import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
export const POST = async (req: NextRequest) => {
    try {
        const { articleId, replyText, commentId } = await req.json();
        const session = await currentUser();
        
        if (!articleId || !replyText || !commentId) {
            return NextResponse.json({
                message: "No credentials Found",
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                clerkUserId: session?.id,
            },
        });

        const comment = await prisma.comment.findFirst({
            where: {
                id: commentId,
            },
        });

        const replyComment = await prisma.comment.create({
            data: {
                comment: replyText,
                userid: user?.id as string,
                articleid: articleId,
                parentId: comment?.id,
            },
        });

        if (replyComment) {
            return NextResponse.json({
                message: "Reply added",
                
            });
        }


    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: "Internal Server error"
        }, {
            status: 500
        })
    }
};
