-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_articleid_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_articleid_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_articleid_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleid_fkey" FOREIGN KEY ("articleid") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_articleid_fkey" FOREIGN KEY ("articleid") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_articleid_fkey" FOREIGN KEY ("articleid") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
