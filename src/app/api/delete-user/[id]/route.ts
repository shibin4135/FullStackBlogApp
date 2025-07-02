import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import cloudinary from "@/lib/cloudinary";


export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const id =(await params).id;
    const article = await prisma.article.findUnique({
      where: {
        id,
      },
    });

     if (!article) {
      return NextResponse.json({
        message: "No article Found",
      });
    }

    const imageUrl = article?.coverPic;
    const extractedUrl = imageUrl
      ?.split("/upload")
      .at(1)
      ?.split(".")
      .at(0)
      ?.split("/")
      .slice(1)
      .join("/");

    await cloudinary.uploader.destroy(extractedUrl as string);

   
    await prisma.article.delete({
      where: {
        id: article.id,
      },
    });
    return NextResponse.json({
      message: "Article Deleted Successfully",
      success: true,
    });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Internal Server error",
    });
  }
};
