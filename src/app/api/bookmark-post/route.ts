import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"

export const POST = async (req: NextRequest) => {
    try {
        const formdata = await req.formData();
        const articleid = formdata.get("articleId") as string;
        const userid = formdata.get("userId") as string;

        if (!articleid || !userid) {
            return NextResponse.json({
                message: "Credentials missing"
            })
        }

        const user = await prisma.user.findFirst({
            where: {
                clerkUserId: userid
            }
        })

        if (! user || ! user.id) {
            return NextResponse.json({
                message: "No user Found"
            })
        }

        const isAlreadyBookmarked = await prisma.bookmark.findFirst({
            where: {
                userid: user?.id,
                articleid: articleid
            }
        })

        if (isAlreadyBookmarked) {
            await prisma.bookmark.delete({
                where: {
                    userid_articleid: {
                        userid: user?.id,
                        articleid: articleid
                    }
                }
            })

            return NextResponse.json({
                message: "BookMark Removed",
                alreadyBookmarked: false
            })
        }

        await prisma.bookmark.create({
            data: {
                userid: user?.id,
                articleid: articleid
            }
        })

        return NextResponse.json({
            message: "Post Bookmarked Successfully",
            alreadyBookmarked:true
        })


    } catch  {

        return NextResponse.json({
            message: "Internal Server error"
        }, {
            status: 500
        })
    }
};
