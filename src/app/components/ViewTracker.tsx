"use client";
import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  articleId: string;
}

const ViewTracker = ({ articleId }: ViewTrackerProps) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;

    // Track view after a short delay to ensure user actually viewed the article
    const timer = setTimeout(() => {
      fetch("/api/track-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      }).catch((error) => {
        console.error("Error tracking view:", error);
      });
      hasTracked.current = true;
    }, 2000); // Track after 2 seconds

    return () => clearTimeout(timer);
  }, [articleId]);

  return null;
};

export default ViewTracker;

