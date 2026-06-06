// src/components/college/ReviewForm.tsx
// Form to submit a review. Only shown to logged-in users.

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { Review } from "@/types";

interface ReviewFormProps {
  collegeId: string;
  onReviewSubmit: (review: Review) => void;
}

export function ReviewForm({ collegeId, onReviewSubmit }: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!session) {
    return (
      <div className="card p-4 text-center text-sm text-gray-600">
        <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
          Sign in
        </Link>{" "}
        to write a review
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a rating"); return; }
    if (comment.trim().length < 10) { setError("Review must be at least 10 characters"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/colleges/${collegeId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      onReviewSubmit(data);
      setSuccess(true);
      setComment("");
      setRating(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card p-4 text-center text-green-700 bg-green-50 border-green-200">
        ✅ Your review has been submitted!
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-gray-900 mb-3">Write a Review</h3>
      
      {/* Star Rating Picker */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            className={`text-3xl transition-colors ${
              star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-gray-600 self-center ml-2">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience at this college..."
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary text-sm mt-3"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
