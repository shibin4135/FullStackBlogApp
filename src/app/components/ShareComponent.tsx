"use client"
import { Share2, Check } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const ShareComponent = () => {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Check out this article",
                    text: "Interesting article I found",
                    url: window.location.href
                })
            } catch {
                // User cancelled or error occurred
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href)
                setCopied(true)
                toast.success("Link copied to clipboard!")
                setTimeout(() => setCopied(false), 2000)
            } catch {
                toast.error("Failed to copy link")
            }
        }
    }
    
    return (
        <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-muted transition-colors"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Copied!</span>
                </>
            ) : (
                <>
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Share</span>
                </>
            )}
        </Button>
    )
}

export default ShareComponent