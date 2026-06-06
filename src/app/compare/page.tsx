// src/app/compare/page.tsx
// Compare 2-3 colleges side by side in a table

"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner, ErrorMessage } from "@/components/ui/index";

interface CompareCollege {
  id: string;
  name: string;
  location: string;
  type: string;
  established: number;
  totalFees: number;
  rating: number;
  accreditation: string | null;
  avgPackage: number | null;
  highestPackage: number | null;
  placementRate: number | null;
  courses: { id: string; name: string; fees: number; duration: number; seats: number }[];
  _count: { reviews: number };
}

function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids");

  const [colleges, setColleges] = useState<CompareCollege[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!idsParam) return;
    setLoading(true);
    fetch(`/api/compare?ids=${idsParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setColleges(data.colleges);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [idsParam]);

  const fmt = (fees: number) =>
    fees >= 100000 ? `₹${(fees / 100000).toFixed(1)}L/yr` : `₹${fees.toLocaleString("en-IN")}`;

  // Table row helper: renders a label + N values across colleges
  const Row = ({ label, values, highlight = false }: {
    label: string;
    values: (string | number)[];
    highlight?: boolean;
  }) => {
    // Find the best value index (only for numeric values)
    const nums = values.map((v) => (typeof v === "number" ? v : parseFloat(String(v))));
    const maxVal = Math.max(...nums.filter((n) => !isNaN(n)));

    return (
      <tr className={highlight ? "bg-blue-50" : "bg-white even:bg-gray-50"}>
        <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 w-36">
          {label}
        </td>
        {values.map((val, i) => {
          const num = typeof val === "number" ? val : parseFloat(String(val));
          const isBest = !isNaN(num) && num === maxVal && nums.filter((n) => n === maxVal).length === 1;
          return (
            <td
              key={i}
              className={`px-4 py-3 text-sm text-center ${isBest ? "font-bold text-green-700" : "text-gray-700"}`}
            >
              {val}
              {isBest && <span className="ml-1 text-xs">✓</span>}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compare Colleges</h1>
          <p className="text-gray-500 text-sm mt-1">
            Compare fees, placements, and more side by side
          </p>
        </div>
        <Link href="/colleges" className="btn-secondary text-sm">
          ← Browse Colleges
        </Link>
      </div>

      {/* No colleges selected state */}
      {!idsParam && (
        <div className="card p-12 text-center">
          <span className="text-5xl mb-4 block">⚖️</span>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Colleges Selected</h2>
          <p className="text-gray-500 mb-6">
            Go to the colleges listing and click "+ Compare" on 2-3 colleges you want to compare.
          </p>
          <Link href="/colleges" className="btn-primary">
            Browse Colleges
          </Link>
        </div>
      )}

      {loading && <LoadingSpinner text="Loading comparison..." />}
      {error && <ErrorMessage message={error} />}

      {colleges.length >= 2 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left text-sm font-medium w-36">Feature</th>
                  {colleges.map((c) => (
                    <th key={c.id} className="px-4 py-3 text-center text-sm font-medium">
                      <Link href={`/colleges/${c.id}`} className="hover:underline">
                        {c.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <Row label="Location" values={colleges.map((c) => c.location)} />
                <Row label="Type" values={colleges.map((c) => c.type)} />
                <Row label="Established" values={colleges.map((c) => c.established)} />
                <Row label="Accreditation" values={colleges.map((c) => c.accreditation ?? "N/A")} />
                <Row label="Annual Fees" values={colleges.map((c) => fmt(c.totalFees))} />
                <Row label="Rating" values={colleges.map((c) => `${c.rating} ★`)} highlight />
                <Row label="Avg Package" values={colleges.map((c) => c.avgPackage ? `${c.avgPackage} LPA` : "N/A")} highlight />
                <Row label="Highest Package" values={colleges.map((c) => c.highestPackage ? `${c.highestPackage} LPA` : "N/A")} />
                <Row label="Placement %" values={colleges.map((c) => c.placementRate ? `${c.placementRate}%` : "N/A")} highlight />
                <Row label="Total Reviews" values={colleges.map((c) => c._count.reviews)} />
                <Row
                  label="Courses"
                  values={colleges.map((c) => `${c.courses.length} courses`)}
                />
              </tbody>
            </table>
          </div>

          {/* Note about green checkmark */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
            ✓ = Best value in that category
          </div>
        </div>
      )}
    </div>
  );
}
export default function ComparePage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading comparison..." />}>
      <CompareContent />
    </Suspense>
  );
}