// src/types/index.ts
// Shared TypeScript types used across the application

export interface Course {
  id: string;
  name: string;
  duration: number;
  fees: number;
  seats: number;
  collegeId: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type: string;
  established: number;
  totalFees: number;
  rating: number;
  imageUrl: string | null;
  description: string;
  website: string | null;
  accreditation: string | null;
  avgPackage: number | null;
  highestPackage: number | null;
  placementRate: number | null;
  courses: Course[];
  reviews: Review[];
  _count?: { savedBy: number; reviews: number };
  isSaved?: boolean; // whether the current user has saved this college
}

// API response shape
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Filters used on the listing page
export interface CollegeFilters {
  search?: string;
  state?: string;
  type?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

// Extend NextAuth session type to include user id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
