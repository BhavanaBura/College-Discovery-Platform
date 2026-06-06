// src/components/college/CollegeCard.tsx
// Displays a college summary card on the listing page

import Link from "next/link";

interface CollegeCardProps {
  college: {
    id: string;
    name: string;
    location: string;
    type: string;
    totalFees: number;
    rating: number;
    accreditation?: string | null;
    avgPackage?: number | null;
    placementRate?: number | null;
    _count?: { reviews: number };
  };
  // Optional: show a checkbox to add to comparison
  onCompareToggle?: (id: string) => void;
  isInCompare?: boolean;
}

export function CollegeCard({ college, onCompareToggle, isInCompare }: CollegeCardProps) {
  // Format fees to a readable string e.g. "2.2 L/yr"
  const formatFees = (fees: number) => {
    if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L/yr`;
    return `₹${fees.toLocaleString("en-IN")}/yr`;
  };

  // Color-code the badge based on college type
  const typeColor = {
    Government: "bg-green-100 text-green-800",
    Private: "bg-blue-100 text-blue-800",
    Deemed: "bg-purple-100 text-purple-800",
  }[college.type] ?? "bg-gray-100 text-gray-800";

  return (
    <div className="card p-5 flex flex-col gap-3">
      
      {/* Header: name + type badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/colleges/${college.id}`}
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {college.name}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">{college.location}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${typeColor}`}>
          {college.type}
        </span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-lg ${star <= Math.round(college.rating) ? "text-yellow-400" : "text-gray-200"}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">{college.rating.toFixed(1)}</span>
        {college._count && (
          <span className="text-xs text-gray-400">({college._count.reviews} reviews)</span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center bg-gray-50 rounded-lg p-2">
        <div>
          <p className="text-xs text-gray-500">Fees</p>
          <p className="text-sm font-semibold text-gray-800">{formatFees(college.totalFees)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Avg Package</p>
          <p className="text-sm font-semibold text-gray-800">
            {college.avgPackage ? `${college.avgPackage}L` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Placement</p>
          <p className="text-sm font-semibold text-gray-800">
            {college.placementRate ? `${college.placementRate}%` : "N/A"}
          </p>
        </div>
      </div>

      {/* Accreditation */}
      {college.accreditation && (
        <p className="text-xs text-gray-500">
          🏆 {college.accreditation}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Link
          href={`/colleges/${college.id}`}
          className="btn-primary text-sm flex-1 text-center"
        >
          View Details
        </Link>
        {onCompareToggle && (
          <button
            onClick={() => onCompareToggle(college.id)}
            className={`text-sm px-3 py-2 rounded-lg border font-medium transition-colors ${
              isInCompare
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {isInCompare ? "✓ Added" : "+ Compare"}
          </button>
        )}
      </div>
    </div>
  );
}
