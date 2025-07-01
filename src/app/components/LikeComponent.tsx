"use client"
import { useUser } from '@clerk/nextjs'
import { Heart } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
    articleId: string
    likes: number
}

const LikeComponent = ({ articleId, likes }: Props) => {
    const { user } = useUser()
    const userId = user?.id

    const [isliked, setIsLiked] = useState<boolean>(false)
    const [likeCount, setLikeCount] = useState(likes)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formdata = new FormData();
        formdata.append("articleId", articleId)
        formdata.append("userId", userId as string)
        try {
            const response = await fetch('/api/like-post', {
                method: "POST",
                body: formdata
            })
            const result = await response.json();
            setIsLiked(result.liked)
            setLikeCount((prev) => !result.liked ? prev + 1 : prev - 1)
        } catch (error) {
            console.log('Something Went Wrong', error)
        }
    }

    return (
        <div className="flex items-center space-x-2">
            <form onSubmit={handleSubmit}>
                <button
                    type="submit"
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-red-100 transition-all duration-200"
                >
                    <Heart
                        className={`w-5 h-5 transition-all duration-200 ${! isliked && likeCount >= 1 ? "fill-red-500 text-red-500" : "fill-none text-gray-500"
                            }`}
                    />
                    <span className="text-sm font-medium text-gray-700">{likeCount}</span>
                </button>
            </form>
        </div>
    )
}

export default LikeComponent
