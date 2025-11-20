"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface RelatedArticle {
  id: string;
  title: string;
  coverPic: string;
  category: string;
  tags: string[];
  created_at: Date;
  views: number;
  user: {
    name: string;
    imageUrl: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

interface RelatedArticlesProps {
  articleId: string;
  category: string;
  tags: string[];
}

const RelatedArticles = ({ articleId, category, tags }: RelatedArticlesProps) => {
  const [articles, setArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          articleId,
          category,
          tags: tags.join(","),
        });
        const response = await fetch(`/api/related-articles?${params}`);
        const data = await response.json();
        if (data.success) {
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error("Error fetching related articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category || tags.length > 0) {
      fetchRelated();
    }
  }, [articleId, category, tags]);

  if (loading || articles.length === 0) {
    return null;
  }

  const getReadingTime = (content: string) => {
    const text = content.replace(/<[^>]*>/g, "");
    return Math.ceil(text.length / 200);
  };

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Related Articles</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              {article.coverPic && (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={article.coverPic}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                  {article.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="line-clamp-2 text-lg">
                  {article.title.replace(/<[^>]*>/g, "")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(article.created_at), "MMM dd")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getReadingTime(article.title)} min
                  </div>
                  <div className="text-xs">
                    {article.views} views
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {article.user.imageUrl && (
                    <Image
                      src={article.user.imageUrl}
                      alt={article.user.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {article.user.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;

