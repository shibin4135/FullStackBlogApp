'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';


interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at?: Date;
  user: {
    name: string;
    email: string;
    imageUrl: string
  }
}

const getStripHtml = (html: string) => {
  return html.replace(/<[^>]+>/g, "");
};

const getExtractedText = (html: string, maxLength = 150) => {
  const plainText = getStripHtml(html);
  return plainText.length > maxLength
    ? plainText.slice(0, maxLength) + "..."
    : plainText;
};

const RecentArticles = () => {
  const [articles, setArtciles] = useState<Article[]>([])

  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        const response = await fetch("/api/fetch-articles");
        const data = await response.json();
        setArtciles(data.articles.slice(0, 6)) // Show only 6 recent articles
      } catch (error) {
        console.log('Something Went Wrong', error)
      }
    }
    fetchRecentArticles()
  }, [])

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Latest Content
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Recent Articles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest insights, stories, and ideas from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {article.category || 'General'}
                  </Badge>
                  {article.created_at && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(article.created_at), 'MMM dd')}
                    </div>
                  )}
                </div>
                
                <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                  <div dangerouslySetInnerHTML={{ __html: article.title }} />
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {getExtractedText(article.content)}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <Image
                      src={article?.user?.imageUrl || '/default-avatar.png'}
                      alt={article?.user?.name || 'avatar'}
                      height={32}
                      width={32}
                      className='rounded-full object-cover ring-2 ring-background'
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {article?.user?.name || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        Author
                      </div>
                    </div>
                  </div>
                </div>

                <Link href={`/articles/${article.id}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {articles.length >= 6 && (
          <div className="text-center mt-12">
            <Link href="/articles">
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8"
              >
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentArticles;
