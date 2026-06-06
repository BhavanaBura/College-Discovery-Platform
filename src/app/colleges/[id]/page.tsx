// src/app/colleges/[id]/page.tsx
// Full detail page for a single college

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner, ErrorMessage, StarRating } from "@/components/ui/index";
import { ReviewForm } from "@/components/college/ReviewForm";
import type { College } from "@/types";

export default function CollegeDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: session } = useSession();
  const router = useRouter();

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");

  useEffect(() => {
    fetch(`/api/colleges/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setCollege(data);
        setIsSaved(data.isSaved);
      })
      .catch(() => setError("Failed to load college details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveToggle = async () => {
    if (!session) { router.push("/auth/signin"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: id }),
      });
      const data = await res.json();
      if (res.ok) setIsSaved(data.saved);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><LoadingSpinner /></div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!college) return null;

  const formatFees = (fees: number) =>
    fees >= 100000 ? `₹${(fees / 100000).toFixed(1)}L/yr` : `₹${fees.toLocaleString("en-IN")}/yr`;

  const tabs = ["overview", "courses", "placements", "reviews"] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Back link */}
      <Link href="/colleges" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Colleges
      </Link>

      {/* Header Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                college.type === "Government" ? "bg-green-100 text-green-800" :
                college.type === "Private" ? "bg-blue-100 text-blue-800" :
                "bg-purple-100 text-purple-800"
              }`}>{college.type}</span>
              {college.accreditation && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  🏆 {college.accreditation}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{college.name}</h1>
            <p className="text-gray-500 mt-1">📍 {college.location} · Est. {college.established}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSaveToggle}
              disabled={saving}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isSaved
                  ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {saving ? "..." : isSaved ? "❤ Saved" : "🤍 Save"}
            </button>
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                Visit Website ↗
              </a>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <StarRating rating={college.rating} />
          <span className="text-sm text-gray-400">
            ({college._count?.reviews ?? 0} reviews)
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Annual Fees", value: formatFees(college.totalFees), icon: "💰" },
          { label: "Avg Package", value: college.avgPackage ? `${college.avgPackage} LPA` : "N/A", icon: "💼" },
          { label: "Highest Package", value: college.highestPackage ? `${college.highestPackage} LPA` : "N/A", icon: "🚀" },
          { label: "Placement Rate", value: college.placementRate ? `${college.placementRate}%` : "N/A", icon: "📊" },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-lg font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">About {college.name}</h2>
          <p className="text-gray-600 leading-relaxed">{college.description}</p>
        </div>
      )}

      {activeTab === "courses" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Course", "Duration", "Annual Fees", "Seats"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {college.courses.map((course, i) => (
                  <tr key={course.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-900">{course.name}</td>
                    <td className="px-4 py-3 text-gray-600">{course.duration} years</td>
                    <td className="px-4 py-3 text-gray-600">{formatFees(course.fees)}</td>
                    <td className="px-4 py-3 text-gray-600">{course.seats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "placements" && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Placement Statistics</h2>
          {[
            { label: "Average Package", value: college.avgPackage ? `${college.avgPackage} LPA` : "Not Available", color: "bg-blue-500" },
            { label: "Highest Package", value: college.highestPackage ? `${college.highestPackage} LPA` : "Not Available", color: "bg-green-500" },
            { label: "Placement Rate", value: college.placementRate ? `${college.placementRate}%` : "Not Available", color: "bg-yellow-500" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                <span className="text-sm font-bold text-gray-900">{stat.value}</span>
              </div>
              {college.placementRate && stat.label === "Placement Rate" && (
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className={`${stat.color} h-2 rounded-full transition-all`}
                    style={{ width: `${college.placementRate}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          {/* Review form for logged-in users */}
          <ReviewForm
            collegeId={id}
            onReviewSubmit={(review) => {
              setCollege((prev) =>
                prev ? { ...prev, reviews: [review, ...prev.reviews] } : prev
              );
            }}
          />

          {/* Existing reviews */}
          {college.reviews.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">
              <p className="text-3xl mb-2">💬</p>
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            college.reviews.map((review) => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                    {review.user.name?.[0] ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.user.name ?? "Anonymous"}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
