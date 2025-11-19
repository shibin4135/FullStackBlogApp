import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import { prisma } from "../../lib/prisma";
import { currentUser } from '@clerk/nextjs/server';
import { BookmarkIcon, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

const Bookmarks = async () => {
    const session = await currentUser();
    const userId = session?.id;

    const user = await prisma.user.findFirst({
        where: {
            clerkUserId: userId as string
        }
    });

    const bookmarks = await prisma.bookmark.findMany({
        where: {
            userid: user?.id
        },
        include: {
            article: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    category: true,
                    created_at: true,
                }
            }
        },
        orderBy: {
            created_at: "desc"
        }
    });

    const striphtml = (html: string) => {
        return html.replace(/<[^>]*>/g, '');
    };

    const extractText = (html: string, maxlength = 200) => {
        const plainText = striphtml(html);
        return plainText.length > maxlength ? plainText.substring(0, maxlength) + '...' : plainText;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                        <BookmarkIcon className="h-4 w-4" />
                        Saved Articles
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Your Bookmarks
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Articles you've saved for later reading
                    </p>
                    {bookmarks.length > 0 && (
                        <Badge variant="secondary" className="mt-4">
                            {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
                        </Badge>
                    )}
                </div>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                            <BookmarkIcon className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Start exploring articles and bookmark the ones you want to read later
                        </p>
                        <Link href="/articles">
                            <Button className="bg-primary hover:bg-primary/90">
                                Explore Articles
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bookmarks.map((bookmark) => (
                            <Card
                                key={bookmark.id}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                <CardHeader className="relative z-10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        {bookmark.article.category && (
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                                {bookmark.article.category}
                                            </Badge>
                                        )}
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(bookmark.article.created_at), 'MMM dd')}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                        <div dangerouslySetInnerHTML={{ __html: bookmark.article.title }} />
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="relative z-10 space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                        {extractText(bookmark.article.content)}
                                    </p>
                                    
                                    <Link href={`/articles/${bookmark.article.id}`}>
                                        <Button 
                                            variant="ghost" 
                                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                                        >
                                            Read Article
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookmarks;
