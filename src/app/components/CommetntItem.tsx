"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Comment } from "./CommentComponent";
import { Reply, Send, User } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  onReplyAdded?: () => void;
}

const CommentItem = ({ comment, articleId, onReplyAdded }: CommentItemProps) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (id: string) => {
    if (!replyText.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reply-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: id, replyText, articleId }),
      });
      if (response.ok) {
        await response.json();
        setReplyText("");
        setIsReplyOpen(false);
        // Refresh comments without page reload
        if (onReplyAdded) {
          onReplyAdded();
        }
      } else {
        console.error("Failed to post reply");
      }
    } catch (error) {
      console.log("Something went wrong", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border hover:border-primary/20 transition-colors">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-3">
          {comment.user?.imageUrl ? (
            <Image
              src={comment.user.imageUrl}
              alt={comment.user.name || "User"}
              width={32}
              height={32}
              className="rounded-full border border-border object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-border">
              <User className="h-4 w-4 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {comment.user?.name || "Anonymous"}
            </p>
            {comment.created_at && (
              <p className="text-xs text-muted-foreground">
                {format(new Date(comment.created_at), "MMM dd, yyyy 'at' h:mm a")}
              </p>
            )}
          </div>
        </div>

        {/* Comment Text */}
        <p className="text-sm text-foreground leading-relaxed mb-3 pl-11">{comment.comment}</p>
        
        {/* Reply Button */}
        <button
          onClick={() => setIsReplyOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors ml-11"
        >
          <Reply className="h-3.5 w-3.5" />
          {isReplyOpen ? "Cancel" : "Reply"}
        </button>

        {/* Reply Form */}
        {isReplyOpen && (
          <div className="mt-3 pt-3 border-t border-border space-y-3 ml-11">
            <Input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && replyText.trim()) {
                  e.preventDefault();
                  handleSubmit(comment.id);
                }
              }}
            />
            <Button 
              onClick={() => handleSubmit(comment.id)}
              disabled={isSubmitting || !replyText.trim()}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Send className="h-3.5 w-3.5 mr-2" />
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 sm:ml-8 pl-4 border-l-2 border-border/50 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              articleId={articleId}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
