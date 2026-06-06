// src/app/colleges/page.tsx
// College listing page with search, filters, and pagination

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CollegeCard } from "@/components/college/CollegeCard";
import { SearchFilters } from "@/components/college/SearchFilters";
import { LoadingSpinner, ErrorMessage, EmptyState, Pagination } from "@/components/ui/index";

interface College {
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
}

export default function CollegesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [compareList, setCompareList] = useState<string[]>([]);

  const currentPage = Number(searchParams.get("page")) || 1;

  // Build API URL from current filters
  const fetchColleges = useCallback(async (filters: Record<string, string>, page: number) => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });

      const res = await fetch(`/api/colleges?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load colleges");

      setColleges(data.colleges);
      setPagination(data.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // Store filters in state so we can pass to pagination
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchColleges(activeFilters, currentPage);
  }, [fetchColleges, activeFilters, currentPage]);

  const handleFilterChange = (filters: Record<string, string>) => {
    setActiveFilters(filters);
    router.push("/colleges"); // reset to page 1 on filter change
  };

  const handlePageChange = (page: number) => {
    router.push(`/colleges?page=${page}`);
  };

  const toggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) {
        alert("You can compare up to 3 colleges at a time");
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Colleges</h1>
        <p className="text-gray-500 mt-1">
          {pagination.total > 0 ? `${pagination.total} colleges found` : "Search and filter colleges"}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6">
        <SearchFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Compare Bar — shows when 2+ colleges selected */}
      {compareList.length >= 2 && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-blue-700 font-medium">
            {compareList.length} colleges selected for comparison
          </span>
          <a
            href={`/compare?ids=${compareList.join(",")}`}
            className="btn-primary text-sm"
          >
            Compare Now →
          </a>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading colleges..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : colleges.length === 0 ? (
        <EmptyState
          title="No colleges found"
          description="Try adjusting your search or removing some filters."
          icon="🏫"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onCompareToggle={toggleCompare}
                isInCompare={compareList.includes(college.id)}
              />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
