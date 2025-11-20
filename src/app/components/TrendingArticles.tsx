"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

interface TrendingArticle {
  id: string;
  title: string;
  coverPic?: string;
  category: string;
  views: number;
  created_at: Date;
  user: {
    name: string;
    imageUrl?: string;
  };
  _count: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
  engagementScore: number;
}

const TrendingArticles = () => {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/analytics?type=trending");
        const data = await response.json();
        if (data.trendingArticles) {
          setArticles(data.trendingArticles.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching trending articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          Trending Articles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="block p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title.replace(/<[^>]*>/g, "")}
                  </h3>
                  <TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {article.category}
                  </Badge>
                  <span>•</span>
                  <span>{article.views} views</span>
                  <span>•</span>
                  <span>{article._count.likes} likes</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        <Link
          href="/articles"
          className="flex items-center justify-center gap-2 text-sm text-primary hover:underline pt-2"
        >
          View all articles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default TrendingArticles;

