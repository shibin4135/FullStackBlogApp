"use client";

import { Calendar, FileText, Loader, User } from "lucide-react";
import React, { useState } from "react";
import Search from "./Search";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ButtonComp from "./ButtonComp";
import { useUser } from "@clerk/nextjs";
import Pagination from "./Pagination";

export interface Article {
    id: string;
    title: string;
    content: string;
    created_at: Date;
    user: {
        name: string;
        imageUrl: string | null;
        clerkUserId: string;
    };
    _count: {
        likes: number;
        comments: number;
        bookmarks: number;
    };
}

interface Props {
    articles: Article[];
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(date));
};

const getStripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, "");
};

const getExtractedText = (html: string, maxLength = 100) => {
    const plainText = getStripHtml(html);
    return plainText.length > maxLength
        ? plainText.slice(0, maxLength) + "..."
        : plainText;
};

const ArticleClient = ({ articles }: Props) => {
    const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState<boolean>(false)

    if (!isLoaded) return null;

    if (!articles.length) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-16 text-center">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-3xl font-bold">No Articles Yet</h1>
                <p className="text-muted-foreground mt-2">
                    You haven&apos;t written any articles yet. Start creating your first article!
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-primary/20">
                        <FileText className="h-4 w-4" />
                        Your Content
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-3 sm:mb-4">
                        Your Articles
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                        Discover and manage all your published articles in one place.
                    </p>
                    <div className="flex justify-center mt-4">
                        <Badge variant="secondary" className="text-xs sm:text-sm">
                            {articles.length} {articles.length === 1 ? "Article" : "Articles"}
                        </Badge>
                    </div>
                </div>

                <div className="mb-6 sm:mb-8">
                    <Search setFilteredArticles={setFilteredArticles} setLoading={setLoading} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredArticles.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <p className="text-lg text-muted-foreground">
                                No articles match your search.
                            </p>
                        </div>
                    ) : (
                        loading ? (
                            <div className="col-span-full flex justify-center items-center min-h-[200px]">
                                <Loader className="animate-spin w-10 h-10 text-primary" />
                            </div>
                        )
                            :
                            (
                                <>
                                    {
                                        filteredArticles.map((article, index) => (
                                            <Card
                                                key={`${article.id}-${index}`}
                                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm card-hover"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

                                                <CardHeader className="relative z-10 space-y-3 p-4 sm:p-6">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <Badge variant="outline" className="bg-muted/50 text-xs">#{index + 1}</Badge>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Calendar className="h-3 w-3 flex-shrink-0" />
                                                            <span className="hidden sm:inline">{formatDate(article.created_at)}</span>
                                                            <span className="sm:hidden">{formatDate(article.created_at).split(',')[0]}</span>
                                                        </div>
                                                    </div>

                                                    <CardTitle className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors duration-200 line-clamp-2">
                                                        <div dangerouslySetInnerHTML={{ __html: article.title }} />
                                                    </CardTitle>

                                                    <CardDescription className="mt-1">
                                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                                            {getExtractedText(article.content)}
                                                        </p>
                                                        <Link
                                                            href={`/articles/${article.id}`}
                                                            className="mt-2 inline-block text-xs sm:text-sm font-medium text-primary hover:underline"
                                                        >
                                                            Read more →
                                                        </Link>
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent className="relative z-10 pt-3 border-t border-border/50 p-4 sm:p-6">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                            <Image
                                                                src={article.user?.imageUrl || "/file.svg"}
                                                                width={36}
                                                                height={36}
                                                                alt={`${article.user?.name}'s profile`}
                                                                className="rounded-full object-cover ring-2 ring-background shadow-sm flex-shrink-0"
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                                                                    {article.user?.name || "Unknown Author"}
                                                                </p>
                                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                                    {article.user?.clerkUserId === user?.id ? "Author" : ""}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {article.user?.clerkUserId === user?.id && (
                                                            <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                                                                <Link href={`/articles/editArticle/${article.id}`}>
                                                                    <Button size="sm" variant="outline" className="text-xs px-2 sm:px-3">
                                                                        Edit
                                                                    </Button>
                                                                </Link>
                                                                <ButtonComp id={article.id} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    }
                                </>)
                    )}
                </div>
                <div className="mt-8">
                    <Pagination setFilteredArticles={setFilteredArticles} />
                </div>
            </div>
        </div>
    );
};

export default ArticleClient;
