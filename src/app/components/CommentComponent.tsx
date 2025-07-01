"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { MessageCircleMore } from "lucide-react";
import React, { useEffect, useState } from "react";
import CommentItem from "./CommetntItem";


export interface Comment {
  id: string;
  comment: string;
  articleId: string;
  parentId: string | null;
  userid: string;
  replies?: Comment[];
}

const CommentComponent = ({ articleId }: { articleId: string }) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useUser();
  const userId = user?.id;

  const fetchComments = async () => {
    const response = await fetch("/api/fetch-comments", {
      method: "POST",
      body: JSON.stringify({ articleId }),
    });
    const data = await response.json();
    setComments(data.comments);
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      setComment("");
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsCommentOpen((prev) => !prev)}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium transition"
      >
        <MessageCircleMore className="w-5 h-5" />
        Comment
      </button>

      {isCommentOpen && (
        <div className="mt-4 space-y-6">
          <form onSubmit={handlePost} className="flex flex-col sm:flex-row items-start gap-4">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              className="flex-1 min-w-[250px]"
            />
            <Button type="submit" className="px-6">Post</Button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} articleId={articleId} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentComponent;
