// src/components/ui/LoadingSpinner.tsx
export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}

// src/components/ui/ErrorMessage.tsx — included in same file for simplicity
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
      ⚠ {message}
    </div>
  );
}

// Empty state component
export function EmptyState({ title, description, icon = "🔍" }: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm">{description}</p>
    </div>
  );
}

// Pagination component
export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary text-sm disabled:opacity-40"
      >
        ← Prev
      </button>
      
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="btn-secondary text-sm disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
}

// Star rating display
export function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "text-base" : "text-xl";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${starSize} ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
      <span className="text-sm font-medium text-gray-700 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}
