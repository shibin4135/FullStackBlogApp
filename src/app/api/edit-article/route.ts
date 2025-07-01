import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req: NextRequest) => {
  try {
    
    const formdata = await req.formData();
    const title = formdata.get("title") as string;
    const content = formdata.get("content") as string;
    const category = formdata.get("category") as string;
    const imageFile = formdata.get("file") as File | null;
    const articleId = formdata.get("articleId") as string;

    if (!articleId) {
      return NextResponse.json({
        message: "No Article Found",
      });
    }

    let newImage;

    if (imageFile) {
      const imageBuffer = await imageFile?.arrayBuffer();
      const nodeBuffer = Buffer.from(imageBuffer!);
      const uploadResponse: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const upload_stream = cloudinary.uploader.upload_stream(
            {
              folder: "/blog",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result as UploadApiResponse);
              }
            }
          );
          upload_stream.end(nodeBuffer);
        }
      );
      newImage = uploadResponse.secure_url;
    }

    const article = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: {
        title,
        category,
        content,
        coverPic: newImage,
      },
    });

    return NextResponse.json({
      message: "Updated Successfully",
      article,
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
