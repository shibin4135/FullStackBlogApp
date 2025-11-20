"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Eye, Heart, MessageCircle, TrendingUp, FileText, Bookmark, Sparkles, Target, Award, Zap, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
  overview: {
    totalArticles: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalBookmarks: number;
    averageViews: number;
    averageLikes: number;
    averageComments: number;
  };
  recentArticles: Array<{
    id: string;
    title: string;
    coverPic: string;
    views: number;
    created_at: Date;
    _count: {
      likes: number;
      comments: number;
      bookmarks: number;
    };
  }>;
  topArticles: Array<{
    id: string;
    title: string;
    coverPic: string;
    views: number;
    created_at: Date;
    _count: {
      likes: number;
      comments: number;
      bookmarks: number;
    };
    engagementScore: number;
  }>;
}

const AnalyticsPage = () => {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [overviewRes, trendingRes] = await Promise.all([
          fetch("/api/analytics?type=overview"),
          fetch("/api/analytics?type=trending")
        ]);
        
        const overviewData = await overviewRes.json();
        const trendingData = await trendingRes.json();
        
        if (overviewRes.ok && trendingRes.ok) {
          const totalArticles = overviewData.overview.totalArticles || 1;
          const totalBookmarks = overviewData.recentArticles.reduce((sum: number, a: any) => sum + (a._count?.bookmarks || 0), 0);
          
          const overview = {
            ...overviewData.overview,
            totalBookmarks,
            averageViews: Math.round((overviewData.overview.totalViews || 0) / totalArticles),
            averageLikes: Math.round((overviewData.overview.totalLikes || 0) / totalArticles),
            averageComments: Math.round((overviewData.overview.totalComments || 0) / totalArticles),
          };

          setData({
            overview,
            recentArticles: overviewData.recentArticles || [],
            topArticles: trendingData.trendingArticles?.slice(0, 5) || [],
          });
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Please sign in to view analytics</h1>
          <Link href="/sign-in">
            <Button className="mt-4">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="text-center px-4">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">No analytics data available</h1>
          <Link href="/create-article">
            <Button className="mt-4">Create Your First Article</Button>
          </Link>
        </div>
      </div>
    );
  }

  const calculateEngagementRate = () => {
    if (!data || data.overview.totalViews === 0) return "0";
    const totalEngagement = data.overview.totalLikes + data.overview.totalComments + data.overview.totalBookmarks;
    return ((totalEngagement / data.overview.totalViews) * 100).toFixed(1);
  };

  const getTopPerformingArticle = () => {
    if (!data || data.topArticles.length === 0) return null;
    return data.topArticles[0];
  };

  const maxViews = data.recentArticles.length > 0 
    ? Math.max(...data.recentArticles.map(a => a.views), 1)
    : 1;

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-primary/20">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 gradient-text">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Track your content performance and engagement metrics
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Total Articles</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{data.overview.totalArticles}</div>
              <p className="text-xs text-muted-foreground">Published articles</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Total Views</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Eye className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{data.overview.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All-time views</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Total Likes</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Heart className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{data.overview.totalLikes}</div>
              <p className="text-xs text-muted-foreground">Total likes received</p>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Total Comments</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageCircle className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{data.overview.totalComments}</div>
              <p className="text-xs text-muted-foreground">Total comments</p>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="card-hover border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Engagement Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">{calculateEngagementRate()}%</div>
              <p className="text-xs text-muted-foreground mb-4">
                {(data.overview.totalLikes + data.overview.totalComments + data.overview.totalBookmarks).toLocaleString()} total engagements
              </p>
              <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-2.5 transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(parseFloat(calculateEngagementRate() || "0"), 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Average Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                    <span className="text-muted-foreground">Avg Views</span>
                    <span className="font-semibold">{data.overview.averageViews}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-700"
                      style={{ width: `${Math.min((data.overview.averageViews / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                    <span className="text-muted-foreground">Avg Likes</span>
                    <span className="font-semibold">{data.overview.averageLikes}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-700"
                      style={{ width: `${Math.min((data.overview.averageLikes / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                    <span className="text-muted-foreground">Avg Comments</span>
                    <span className="font-semibold">{data.overview.averageComments}</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-700"
                      style={{ width: `${Math.min((data.overview.averageComments / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                Total Saves
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Bookmark className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{data.overview.totalBookmarks}</div>
              <p className="text-xs text-muted-foreground">Articles bookmarked</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Article */}
        {getTopPerformingArticle() && (
          <Card className="mb-6 sm:mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Award className="h-5 w-5 text-primary" />
                Top Performing Article
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/articles/${getTopPerformingArticle()!.id}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors group">
                  {getTopPerformingArticle()!.coverPic && (
                    <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                      <Image
                        src={getTopPerformingArticle()!.coverPic}
                        alt={getTopPerformingArticle()!.title.replace(/<[^>]*>/g, "")}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 w-full">
                    <h3 className="font-semibold text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {getTopPerformingArticle()!.title.replace(/<[^>]*>/g, "")}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{getTopPerformingArticle()!.views}</span>
                        <span className="text-muted-foreground">views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{getTopPerformingArticle()!._count.likes}</span>
                        <span className="text-muted-foreground">likes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{getTopPerformingArticle()!._count.comments}</span>
                        <span className="text-muted-foreground">comments</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">
                          {getTopPerformingArticle()!.engagementScore} score
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Recent Articles Performance */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Articles Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentArticles.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">No articles yet</p>
                <p className="text-sm text-muted-foreground mb-6">Start writing to see your analytics!</p>
                <Link href="/create-article">
                  <Button className="bg-primary hover:bg-primary/90">
                    Create your first article
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {data.recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.id}`}
                    className="block p-4 sm:p-6 border border-border/50 rounded-xl hover:bg-muted/30 hover:border-primary/30 transition-all group card-hover"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      {article.coverPic && (
                        <div className="relative w-full sm:w-32 h-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:shadow-lg transition-all">
                          <Image
                            src={article.coverPic}
                            alt={article.title.replace(/<[^>]*>/g, "")}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title.replace(/<[^>]*>/g, "")}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(article.created_at), "MMM dd, yyyy")}
                        </p>
                        
                        {/* Visual Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Views</span>
                            <span className="font-semibold">{article.views}</span>
                          </div>
                          <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-2.5 transition-all duration-700"
                              style={{ width: `${(article.views / maxViews) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <div className="text-lg sm:text-xl font-bold mb-1">{article.views}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <Eye className="h-3 w-3" />
                              Views
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <div className="text-lg sm:text-xl font-bold mb-1">{article._count.likes}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <Heart className="h-3 w-3" />
                              Likes
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <div className="text-lg sm:text-xl font-bold mb-1">{article._count.comments}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              Comments
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted/30">
                            <div className="text-lg sm:text-xl font-bold mb-1">{article._count.bookmarks}</div>
                            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <Bookmark className="h-3 w-3" />
                              Saves
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
