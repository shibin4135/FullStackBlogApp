"use client"
import React, { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

interface Props {
  articleId: string;
  bookmarks: number
}

const Bookmarks = ({ bookmarks, articleId }: Props) => {
  const { user } = useUser()
  const userid = user?.id
  const [bookmarked, setBookmarked] = useState<boolean>(false)
  const [bookmarkCount, setBookmarkCount] = useState<number>(bookmarks)
  const [isLoading, setIsLoading] = useState(true)
  const [prevBookmarked, setPrevBookmarked] = useState<boolean | null>(null)

  // Fetch initial bookmark state
  useEffect(() => {
    const fetchBookmarkState = async () => {
      if (!userid) {
        setIsLoading(false)
        return
      }
      
      try {
        const response = await fetch(`/api/bookmark-post?userId=${userid}&articleId=${articleId}`)
        const result = await response.json()
        setBookmarked(result.isBookmarked || false)
      } catch (error) {
        console.log('Error fetching bookmark state:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookmarkState()
  }, [userid, articleId])

  // Show toast when bookmark state changes
  useEffect(() => {
    if (isLoading || prevBookmarked === null) {
      setPrevBookmarked(bookmarked)
      return
    }
    
    if (prevBookmarked !== bookmarked) {
      if (bookmarked) {
        toast.success("Post bookmarked successfully")
      } else {
        toast.success("Bookmark removed")
      }
      setPrevBookmarked(bookmarked)
    }
  }, [bookmarked, isLoading, prevBookmarked])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userid) return;
    
    const formdata = new FormData();
    formdata.append("articleId", articleId)
    formdata.append("userId", userid as string)
    try {
      const response = await fetch("/api/bookmark-post", {
        method: "POST",
        body: formdata
      });
      const result = await response.json();
      // The API returns alreadyBookmarked: false when removed, alreadyBookmarked: true when added
      // So we need to toggle the state
      setBookmarked(!bookmarked)
      setBookmarkCount((prev) => bookmarked ? prev - 1 : prev + 1)
    } catch (error) {
      console.log("Something went wrong", error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="inline-block">
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 transition-all duration-200 ${
          bookmarked 
            ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900" 
            : "hover:bg-muted"
        }`}
      >
        <Bookmark
          className={`h-4 w-4 transition-all duration-200 ${
            bookmarked 
              ? "fill-blue-500 text-blue-500" 
              : "fill-none"
          }`}
        />
        <span className="text-sm font-medium">{bookmarkCount}</span>
      </Button>
    </form>
  )
}

export default Bookmarks