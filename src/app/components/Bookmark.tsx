"use client"
import React, { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

interface Props {
  articleId: string;
  bookmarks: number
}

const Bookmarks = ({ bookmarks, articleId }: Props) => {
  const { user } = useUser()
  const userid = user?.id as string
  const [bookmarked, setBookmarked] = useState<boolean | null>(null)
  const [bookmarkCount, setBookmarkCount] = useState<number>(bookmarks)

  useEffect(() => {
    if (bookmarked === null) return
    if (bookmarked) {
      toast.success("Post Bookmarked Successfully")
    } else {
      toast.error("Removed Bookmark")
    }
  }, [bookmarked])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("articleId", articleId)
    formdata.append("userId", userid)
    try {
      const response = await fetch("/api/bookmark-post", {
        method: "POST",
        body: formdata
      });
      const result = await response.json();
      setBookmarked(result.alreadyBookmarked)
      setBookmarkCount((prev) => result.alreadyBookmarked ? prev + 1 : prev - 1)
    } catch (error) {
      console.log("Something went wrong", error)
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button className='flex gap-1'>
          <Bookmark className={`${bookmarked ? "fill-blue-500 text-white" : "text-black fill-white"}`} />
          <div>{bookmarkCount}</div>
        </button>
      </form>
    </div>
  )
}

export default Bookmarks