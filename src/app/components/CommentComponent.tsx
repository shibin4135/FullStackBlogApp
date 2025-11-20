"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { MessageCircleMore, Send } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import CommentItem from "./CommetntItem";
import toast from 'react-hot-toast';

export interface Comment {
  id: string;
  comment: string;
  articleId: string;
  parentId: string | null;
  userid: string;
  user?: {
    name: string;
    email: string;
    imageUrl?: string | null;
  };
  replies?: Comment[];
  created_at?: string;
}

const CommentComponent = ({ articleId }: { articleId: string }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const userId = user?.id;

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch("/api/fetch-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      });
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!comment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("userId", userId as string);
    formData.append("articleId", articleId);
    formData.append("comment", comment);
    
    try {
      const res = await fetch("/api/create-comment", {
        method: "POST",
        body: formData,
      });
      await res.json();
      if (res.ok) {
        setComment("");
        toast.success("Comment posted!");
        // Refresh comments
        await fetchComments();
      } else {
        toast.error("Failed to post comment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircleMore className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">Comments</h3>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>

      {user ? (
        <form onSubmit={handlePost} className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || !comment.trim()}
              className="px-6"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-muted/50 rounded-lg border border-border text-center">
          <p className="text-sm text-muted-foreground">
            Please sign in to leave a comment
          </p>
        </div>
      )}

      <div className="space-y-4 mt-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircleMore className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              articleId={articleId}
              onReplyAdded={fetchComments}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentComponent;
