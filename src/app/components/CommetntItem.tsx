"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Comment } from "./CommentComponent";

const CommentItem = ({ comment, articleId }: { comment: Comment; articleId: string }) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async (id: string) => {
    try {
      const response = await fetch("/api/reply-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId: id, replyText, articleId }),
      });
      await response.json();
      setReplyText("");
      setIsReplyOpen(false);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };

  return (
    <div className="ml-2 sm:ml-6 relative">
      <div className="border-l-2 border-muted pl-4">
        <div className="bg-card p-4 rounded-lg border shadow-sm space-y-2">
          <p className="text-sm text-foreground">{comment.comment}</p>
          <button
            onClick={() => setIsReplyOpen((prev) => !prev)}
            className="text-xs text-primary hover:underline"
          >
            Reply
          </button>

          {isReplyOpen && (
            <div className="mt-2 flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1"
              />
              <Button onClick={() => handleSubmit(comment.id)}>Post</Button>
            </div>
          )}
        </div>

       {comment.replies?.map((reply) => (
              <CommentItem key={reply.id} comment={reply} articleId={articleId} />
            ))}
      </div>
    </div>
  );
};

export default CommentItem;
