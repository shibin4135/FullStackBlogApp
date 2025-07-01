"use server";

import cloudinary from "@/lib/cloudinary";
import { prisma } from "../src/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { UploadApiResponse } from "cloudinary";
import { z } from "zod";

const articleSchema = z.object({
  title: z.string().nonempty("Title is required"),
  content: z
    .string()
    .min(10, "Min 10 charecters are required")
    .max(5000, "Max 5000 char are allowed")
    .nonempty("content is required"),
  category: z.string().nonempty("Category is required"),
  imageurl: z
    .instanceof(File)
    .refine(
      (file) => file.size < 24 * 1024 * 1024,
      "Size should be less than 24 mb"
    )
    .refine((file) => file.type.startsWith("image/"), {
      message: "The file must be a image",
    }),
});

type initialState = {
  success: boolean;
  errors: {
    title?: string[];
    content?: string[];
    category?: string[];
    imageurl?: string[];
  };
};

export const createArticle = async (
  _: initialState,
  formData: FormData
): Promise<initialState> => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const imageurl = formData.get("file") as File;
  const data = await currentUser();
  const imageBuffer = await imageurl.arrayBuffer();
  const nodeBuffer = Buffer.from(imageBuffer);

  const result = articleSchema.safeParse({
    title,
    content,
    category,
    imageurl,
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const uploadResponse: UploadApiResponse = await new Promise(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "blog" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!);
          }
        }
      );
      uploadStream.end(nodeBuffer);
    }
  );

  const prismaUser = await prisma.user.findFirst({
    where: {
      clerkUserId: data?.id as string,
    },
  });

  await prisma.article.create({
    data: {
      title,
      content,
      category,
      coverPic: uploadResponse?.secure_url,
      userid: prismaUser?.id as string,
    },
  });

  return {
    success: true,
    errors: {},
  };
};
