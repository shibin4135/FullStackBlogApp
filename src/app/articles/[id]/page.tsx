
import React from 'react'
import { prisma } from '../../../lib/prisma'
import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'
import { Calendar, MessageCircleMore, Share } from 'lucide-react'
import { format } from 'date-fns'
import LikeComponent from '@/app/components/LikeComponent'
import Bookmarks from '@/app/components/Bookmark'
import ShareComponent from '@/app/components/ShareComponent'
import CommentComponent from '@/app/components/CommentComponent'

const SingleArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await currentUser()
  const userId = session?.id
  const id = (await params).id

  const article = await prisma.article.findFirst({
    where: { id },
    include: {
      user: true,
      comments: true,
      _count: {
        select: {
          likes: true,
          bookmarks: true,

        }
      }
    },
  })

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold">Article not found.</h1>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 shadow-xl rounded-lg">

      <h1
        className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight text-center"
        dangerouslySetInnerHTML={{ __html: article.title }}
      />

      {/* Author Info */}
      <div className="flex items-center gap-4 mb-8">
        <Image
          src={article.user.imageUrl || '/default-avatar.png'}
          alt="Author"
          width={48}
          height={48}
          className="rounded-full border shadow-sm object-cover"
        />
        <div>
          <p className="text-base font-medium text-foreground">{article.user.name}</p>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(article.created_at), 'dd MMM yyyy')}
            {article.user.clerkUserId === userId && (
              <span className="ml-3 px-2 py-0.5 bg-green-100 dark:bg-green-800 text-xs rounded-full text-green-800 dark:text-green-100">
                You are the Author
              </span>
            )}
          </div>
        </div>
      </div>



      <div className='flex items-center justify-center'>
            <Image src={article?.coverPic} width={200} height={200} alt='CoverPic'/>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      <div className='mt-5 space-x-3 flex items-center'>

        <ShareComponent />
        <Bookmarks articleId={article.id} bookmarks={article._count.bookmarks} />
        <LikeComponent articleId={article.id} likes={article._count.likes} />
        <CommentComponent articleId={article.id} />
      </div>
    </div>
  )
}

export default SingleArticlePage
