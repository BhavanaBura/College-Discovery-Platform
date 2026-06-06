// src/components/college/SearchFilters.tsx
// Search bar + filter panel for the college listing page

"use client";

import { useState } from "react";

interface Filters {
  search: string;
  state: string;
  type: string;
  minFees: string;
  maxFees: string;
  minRating: string;
}

interface SearchFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

// Indian states with colleges in our seed data
const STATES = ["Andhra Pradesh", "Telangana", "Karnataka", "Maharashtra", "Tamil Nadu"];
const TYPES = ["Government", "Private", "Deemed"];

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    state: "",
    type: "",
    minFees: "",
    maxFees: "",
    minRating: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Update a single filter field and notify parent
  const handleChange = (field: keyof Filters, value: string) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const reset: Filters = { search: "", state: "", type: "", minFees: "", maxFees: "", minRating: "" };
    setFilters(reset);
    onFilterChange(reset);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search colleges by name or location..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-blue-50 border-blue-500 text-blue-700"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          ⚙ Filters {hasActiveFilters && <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">●</span>}
        </button>
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          
          {/* State filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">State</label>
            <select
              value={filters.state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All States</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">College Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Min rating filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Minimum Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => handleChange("minRating", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>

          {/* Fees range */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Min Fees (₹/yr)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={filters.minFees}
              onChange={(e) => handleChange("minFees", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Max Fees (₹/yr)</label>
            <input
              type="number"
              placeholder="e.g. 500000"
              value={filters.maxFees}
              onChange={(e) => handleChange("maxFees", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full text-sm text-red-600 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50 transition-colors"
              >
                ✕ Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
