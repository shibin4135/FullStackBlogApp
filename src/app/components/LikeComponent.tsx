"use client"
import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
    articleId: string
    likes: number
}

const LikeComponent = ({ articleId, likes }: Props) => {
    const { user } = useUser()
    const userId = user?.id

    const [isliked, setIsLiked] = useState<boolean>(false)
    const [likeCount, setLikeCount] = useState(likes)

    // Fetch initial like state
    useEffect(() => {
        const fetchLikeState = async () => {
            if (!userId) {
                return
            }
            
            try {
                const response = await fetch(`/api/like-post?userId=${userId}&articleId=${articleId}`)
                const result = await response.json()
                setIsLiked(result.isLiked || false)
            } catch (error) {
                console.log('Error fetching like state:', error)
            }
        }

        fetchLikeState()
    }, [userId, articleId])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!userId) return;
        
        const formdata = new FormData();
        formdata.append("articleId", articleId)
        formdata.append("userId", userId as string)
        try {
            const response = await fetch('/api/like-post', {
                method: "POST",
                body: formdata
            })
            await response.json();
            // The API returns liked: true when removed, liked: false when added
            // So we need to toggle the state
            setIsLiked(!isliked)
            setLikeCount((prev) => isliked ? prev - 1 : prev + 1)
        } catch (error) {
            console.log('Something Went Wrong', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="inline-block">
            <Button
                type="submit"
                variant="outline"
                size="sm"
                className={`flex items-center gap-2 transition-all duration-200 ${
                    isliked 
                        ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900" 
                        : "hover:bg-muted"
                }`}
            >
                <Heart
                    className={`h-4 w-4 transition-all duration-200 ${
                        isliked 
                            ? "fill-red-500 text-red-500 animate-pulse" 
                            : "fill-none"
                    }`}
                />
                <span className="text-sm font-medium">{likeCount}</span>
            </Button>
        </form>
    )
}

export default LikeComponent
