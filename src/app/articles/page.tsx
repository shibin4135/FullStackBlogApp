import { prisma } from "../../lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import ArticleClient from "../components/ArticleClient";

const Articles = async () => {
  const session = await currentUser();
  const user = await prisma.user.findFirst({
    where: {
      clerkUserId: session?.id,
    },
  });

  if (!user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

  const articles = await prisma.article.findMany({
    include: {
      user: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          bookmarks: true
        }
      }
    },
    orderBy: {
      created_at: "desc",
    },
  });


  return <ArticleClient articles={articles} />
};

export default Articles;
