import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { prisma } from "../../lib/prisma";
import { currentUser } from '@clerk/nextjs/server';
import { BookmarkIcon } from 'lucide-react';

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
                    title: true,
                    content: true,
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
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 py-12 px-4 flex justify-center">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-blue-800 mb-2">Your Bookmarks</h1>
                    <p className="text-muted-foreground text-sm">Save and revisit articles you love </p>
                </div>

                {bookmarks.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-10 text-lg">
                        <BookmarkIcon className="mx-auto mb-4 text-blue-400" size={40} />
                        No bookmarks yet. Start exploring!
                    </p>
                ) : (
                    bookmarks.map((bookmark) => (
                        <Card
                            key={bookmark.id}
                            className="bg-white/80 backdrop-blur-md border border-blue-200 shadow-md hover:shadow-xl transition-all duration-200 rounded-xl"
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl font-semibold text-center text-blue-700">
                                    {bookmark.article.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    {extractText(bookmark.article.content)}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Bookmarks;
