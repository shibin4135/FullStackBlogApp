import React from 'react'
import { prisma } from '../../../lib/prisma'
import Image from 'next/image'
import { currentUser } from '@clerk/nextjs/server'
import { Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import LikeComponent from '@/app/components/LikeComponent'
import Bookmarks from '@/app/components/Bookmark'
import ShareComponent from '@/app/components/ShareComponent'
import CommentComponent from '@/app/components/CommentComponent'
import ReadingProgress from '@/app/components/ReadingProgress'
import RelatedArticles from '@/app/components/RelatedArticles'
import ViewTracker from '@/app/components/ViewTracker'
import ExportArticle from '@/app/components/ExportArticle'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const id = (await params).id
  const article = await prisma.article.findFirst({
    where: { id },
    include: { user: true }
  })

  if (!article) {
    return {
      title: 'Article Not Found - BlogNest',
    }
  }

  const plainText = article.content.replace(/<[^>]*>/g, '').slice(0, 160)
  const imageUrl = article.coverPic || article.user.imageUrl || ''

  return {
    title: `${article.title.replace(/<[^>]*>/g, '')} - BlogNest`,
    description: plainText,
    openGraph: {
      title: article.title.replace(/<[^>]*>/g, ''),
      description: plainText,
      images: [imageUrl],
      type: 'article',
      authors: [article.user.name],
      publishedTime: article.created_at.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title.replace(/<[^>]*>/g, ''),
      description: plainText,
      images: [imageUrl],
    },
  }
}

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground">The article you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <ReadingProgress />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <header className="mb-12 animate-fade-in">
          {article.category && (
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              {article.category}
            </Badge>
          )}
          
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 leading-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text text-transparent"
            dangerouslySetInnerHTML={{ __html: article.title }}
          />

          {/* Author Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border">
            <Image
              src={article.user.imageUrl || '/default-avatar.png'}
              alt="Author"
              width={56}
              height={56}
              className="rounded-full border-2 border-primary/20 shadow-md object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-lg font-semibold text-foreground">{article.user.name}</p>
                {article.user.clerkUserId === userId && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                    Author
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(article.created_at), 'MMMM dd, yyyy')}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {Math.ceil((article.content.replace(/<[^>]*>/g, '').length) / 200)} min read
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverPic && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-border">
            <Image 
              src={article.coverPic} 
              width={1200} 
              height={600} 
              alt='Cover'
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <div 
            className="article-content text-foreground leading-8"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>

        {/* Action Bar */}
        <div className="sticky bottom-4 bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-lg mb-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <LikeComponent articleId={article.id} likes={article._count.likes} />
            <Bookmarks articleId={article.id} bookmarks={article._count.bookmarks} />
            <ShareComponent />
            <ExportArticle 
              title={article.title}
              content={article.content}
              author={article.user.name}
              date={format(new Date(article.created_at), 'MMMM dd, yyyy')}
            />
          </div>
        </div>

        {/* Related Articles */}
        {(article.category || (article.tags && article.tags.length > 0)) && (
          <RelatedArticles 
            articleId={article.id} 
            category={article.category}
            tags={(article.tags as string[]) || []}
          />
        )}

        {/* Comments Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8">
          <CommentComponent articleId={article.id} />
        </div>
      </div>
      <ViewTracker articleId={article.id} />
    </article>
  )
}

export default SingleArticlePage
