// src/app/page.tsx
// Landing / Home page

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Find Your Perfect College
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover, compare, and save top colleges across India. Make your
            most important decision with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/colleges"
              className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Browse Colleges →
            </Link>
            <Link
              href="/compare"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Compare Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 px-4 border-b">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "500+", label: "Colleges Listed" },
            { number: "50K+", label: "Students Helped" },
            { number: "28", label: "States Covered" },
            { number: "4.8★", label: "User Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-blue-600">{stat.number}</p>
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            Why CollegeDiscover?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🔍",
                title: "Smart Search & Filters",
                desc: "Search by name, location, fees range, rating, and more to find your ideal college.",
              },
              {
                icon: "⚖️",
                title: "Side-by-Side Comparison",
                desc: "Compare up to 3 colleges at once — fees, placements, ratings, and more in a clear table.",
              },
              {
                icon: "❤️",
                title: "Save Your Favourites",
                desc: "Create an account and bookmark colleges you love. Access your saved list anytime.",
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 text-center">
                <span className="text-4xl">{feature.icon}</span>
                <h3 className="font-semibold text-gray-900 mt-3 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-12 px-4 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to find your college?</h2>
        <p className="text-blue-100 mb-6">Join thousands of students making smarter decisions.</p>
        <Link
          href="/auth/signup"
          className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
}
