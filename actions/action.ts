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
  const tagsJson = formData.get("tags") as string;
  const isDraftStr = formData.get("isDraft") as string;
  const isDraft = isDraftStr === "true";
  
  let tags: string[] = [];
  try {
    tags = tagsJson ? JSON.parse(tagsJson) : [];
  } catch {
    tags = [];
  }
  
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

  if (!prismaUser) {
    return {
      success: false,
      errors: {
        title: ["User not found. Please sign in again."],
      },
    };
  }

  // Build article data - try with new fields first, fallback if they don't exist
  const baseData = {
    title,
    content,
    category,
    coverPic: uploadResponse?.secure_url,
    userid: prismaUser.id,
  };

  try {
    // Try to create with tags and isDraft (after migration)
    await prisma.article.create({
      data: {
        ...baseData,
        tags: tags.slice(0, 10),
        isDraft,
      } as any, // Use 'as any' to bypass TypeScript check for backward compatibility
    });
  } catch (error: any) {
    // If error is about unknown fields (tags or isDraft), retry without them
    if (error?.message?.includes('Unknown argument') && 
        (error?.message?.includes('tags') || error?.message?.includes('isDraft'))) {
      // Fallback: create without tags and isDraft (before migration)
      try {
        await prisma.article.create({
          data: baseData,
        });
      } catch (fallbackError: any) {
        console.error("Error creating article:", fallbackError);
        return {
          success: false,
          errors: {
            title: ["Failed to create article. Please try again."],
          },
        };
      }
    } else {
      // Handle other database errors
      console.error("Error creating article:", error);
      return {
        success: false,
        errors: {
          title: ["Failed to create article. Please try again."],
        },
      };
    }
  }

  return {
    success: true,
    errors: {},
  };
};
