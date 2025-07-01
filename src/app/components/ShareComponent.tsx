"use client"
import { Share } from 'lucide-react'
import React from 'react'

const ShareComponent = () => {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Check Out This Article",
                text: "Interseting one",
                url: `${window.location.href}`
            })
        }
    }
    return (
        <div>
            <button onClick={handleShare}><Share /></button>
        </div>
    )
}

export default ShareComponent