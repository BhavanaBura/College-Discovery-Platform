// src/app/saved/page.tsx
// Protected page — shows colleges saved by the current user

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CollegeCard } from "@/components/college/CollegeCard";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/ui/index";

interface SavedCollege {
  id: string;
  name: string;
  location: string;
  type: string;
  totalFees: number;
  rating: number;
  accreditation?: string | null;
  avgPackage?: number | null;
  placementRate?: number | null;
}

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [colleges, setColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect to sign in if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/saved");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    
    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setColleges(data.colleges);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Colleges</h1>
          <p className="text-gray-500 text-sm mt-1">
            {colleges.length} college{colleges.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Link href="/colleges" className="btn-secondary text-sm">
          Browse More
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}

      {!error && colleges.length === 0 && (
        <EmptyState
          title="No saved colleges yet"
          description="Browse colleges and click the Save button to bookmark them here."
          icon="❤️"
        />
      )}

      {colleges.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {colleges.map((college) => (
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      )}
    </div>
  );
}
