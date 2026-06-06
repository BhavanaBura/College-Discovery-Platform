# 🎓 CollegeDiscover — College Discovery Platform

A full-stack production-ready web app to discover, compare, and save colleges across India.

**Tech Stack:** Next.js 14 · React · TypeScript · Tailwind CSS · PostgreSQL · Prisma ORM · NextAuth.js

---

## 📁 Project Structure

```
college-discovery/
├── prisma/
│   ├── schema.prisma          # Database tables & relationships
│   └── seed.ts                # Sample data (8 Indian colleges)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   │   ├── register/route.ts             # Signup API
│   │   │   ├── colleges/
│   │   │   │   ├── route.ts                  # List + filter colleges
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts              # College detail
│   │   │   │       └── reviews/route.ts      # Submit review
│   │   │   ├── compare/route.ts              # Compare colleges
│   │   │   └── saved/route.ts                # Save/unsave colleges
│   │   ├── auth/
│   │   │   ├── signin/page.tsx               # Login page
│   │   │   └── signup/page.tsx               # Registration page
│   │   ├── colleges/
│   │   │   ├── page.tsx                      # College listing
│   │   │   └── [id]/page.tsx                 # College detail
│   │   ├── compare/page.tsx                  # Compare page
│   │   ├── saved/page.tsx                    # Saved colleges (protected)
│   │   ├── page.tsx                          # Home / landing page
│   │   ├── layout.tsx                        # Root layout
│   │   └── globals.css                       # Global styles
│   ├── components/
│   │   ├── college/
│   │   │   ├── CollegeCard.tsx               # College summary card
│   │   │   ├── SearchFilters.tsx             # Search + filter panel
│   │   │   └── ReviewForm.tsx                # Review submission form
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                    # Top navigation
│   │   │   └── Providers.tsx                 # SessionProvider wrapper
│   │   └── ui/
│   │       └── index.tsx                     # Spinner, Pagination, etc.
│   ├── lib/
│   │   ├── prisma.ts                         # Prisma client singleton
│   │   └── auth.ts                           # NextAuth config
│   └── types/
│       └── index.ts                          # TypeScript interfaces
└── .env.example                              # Environment variable template
```

---

## 🚀 Getting Started

### Step 1: Clone the project

```bash
git clone <your-repo-url>
cd college-discovery
npm install
```

### Step 2: Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
DATABASE_URL="postgresql://..."    # from Neon.tech
NEXTAUTH_SECRET="..."              # run: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

### Step 3: Set up database on Neon

1. Go to [neon.tech](https://neon.tech) → Create account → New project
2. Copy the connection string (enable "Pooling" for Vercel)
3. Paste into `DATABASE_URL` in `.env.local`

### Step 4: Push schema & seed data

```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Create tables in Neon
npm run db:seed        # Add 8 sample colleges
```

### Step 5: Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` (use Neon's **pooled** connection string)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` = your Vercel URL (e.g. `https://college-discover.vercel.app`)
4. Deploy!

---

## 🔑 Features

| Feature | Implementation |
|---------|---------------|
| Auth (Signup/Login) | NextAuth with credentials provider + bcrypt |
| College Listing | Paginated API with search & filters |
| College Detail | Tabs: overview, courses, placements, reviews |
| Compare | Side-by-side table for 2-3 colleges |
| Save Colleges | Toggle save/unsave, protected by auth |
| Reviews | One review per user per college, star rating |

---

## 🗃 Database Schema

```
User ──────── SavedCollege ──── College
  │                                 │
  └──── Review ────────────────────┘
                                    │
                               Course
```

---

## 🧪 Test Accounts

After seeding, create a test account via the Sign Up page at `/auth/signup`.

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List with search/filter/pagination |
| GET | `/api/colleges/:id` | College detail |
| POST | `/api/colleges/:id/reviews` | Add review (auth required) |
| GET | `/api/compare?ids=id1,id2` | Compare 2-3 colleges |
| GET | `/api/saved` | Get saved colleges (auth required) |
| POST | `/api/saved` | Toggle save/unsave (auth required) |
| POST | `/api/register` | Create new user account |
