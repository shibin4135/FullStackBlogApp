'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';


interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  user: {
    name: string;
    email: string;
    imageUrl: string
  }
}


const RecentArticles = () => {
  const [articles, setArtciles] = useState<Article[]>([])

  useEffect(() => {
    const fetchRecentArticles = async () => {
      try {
        const response = await fetch("/api/fetch-articles");
        const data = await response.json();
        setArtciles(data.articles)
      } catch (error) {
        console.log('Something Went Wrong', error)
      }
    }
    fetchRecentArticles()
  }, [])


  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-bold text-4xl text-center mb-12 text-gray-800 dark:text-white">
          Recent Articles
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl rounded-xl border border-gray-200 dark:border-zinc-700"
            >
              <CardHeader>
              
                <CardTitle className="text-2xl mb-2 font-bold text-gray-800 dark:text-white group-hover:text-primary">
                  {article.title}
                </CardTitle>
                  <div className='bg-green-200 w-[100px] text-black rounded-lg shadow-lg animate-bounce'>
                  {article.category}
                </div>
              </CardHeader>

              <CardContent className="text-sm text-gray-700 dark:text-gray-300">
                <div dangerouslySetInnerHTML={{__html:article.content}}></div>
              </CardContent>

              <div className="p-4 pt-0 flex justify-center items-center">
                <Button className="group-hover:bg-gradient-to-r from-purple-500 to-blue-500 transition-colors">
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className='flex flex-col items-center justify-center gap-2'>
                <Image
                  src={article?.user?.imageUrl || '/default-avatar.png'}
                  alt={article?.user?.name || 'avatar'}
                  height={30}
                  width={30}
                  className='rounded-full'
                />
                <p className='text-gray-500'>
                  Author: {article?.user?.name || 'Unknown'}
                </p>
              </div>

            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentArticles;
