import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ articleId: string }> }) => {
    try {
        const { articleId } =await params;
        const article = await prisma.article.findUnique({
            where: {
                id: articleId,
            },
        });
        if (!article) {
            return NextResponse.json({
                status: false,
                message: "No article Found",
            });
        }

        return NextResponse.json({
            article,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "No article Found",
        }, {
            status: 500
        });
    }
};
