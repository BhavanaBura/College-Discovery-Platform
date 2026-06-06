# 🎬 Loom Video Script — CollegeDiscover Platform (5–10 min)

---

## ⏱ Intro (0:00 – 0:40)

"Hi! I'm Bhavana, and today I'm walking you through my internship project —
a full-stack College Discovery Platform called CollegeDiscover.

The app lets students browse colleges across India, filter by location, fees,
and rating, compare colleges side by side, and save their favourites after signing in.

I built this using Next.js 14 with the App Router, TypeScript, Tailwind CSS,
PostgreSQL hosted on Neon, Prisma ORM, and NextAuth for authentication.

Let me start with a quick live demo, then walk through the architecture."

---

## ⏱ Live Demo (0:40 – 3:00)

### Home Page (0:40)
"This is the landing page. It explains what the app does and has clear CTAs
to browse colleges or create an account."

### College Listing (1:00)
"Here's the main listing page. I can see cards for each college showing the
name, type — Government, Private, or Deemed — fees, average placement package,
and rating.

[type in search box] — Searching for 'Hyderabad' filters in real time.

[open filters] — I can also filter by state, college type, rating, and fees range.
All of these combine together in a single API query.

[click + Compare on two colleges] — When I select two colleges, a blue compare
bar appears. Let me click Compare Now."

### Compare Page (1:45)
"This is the comparison table. It shows all key metrics side by side — fees,
rating, average package, placement rate. Notice the green checkmarks — the app
automatically highlights which college has the best value in each numeric category.
That was a small but useful UX touch."

### College Detail (2:15)
"Let me open a college detail page. There are four tabs — Overview, Courses,
Placements, and Reviews. The Courses tab shows a table of all programs offered.
Placements shows a visual progress bar for the placement percentage."

### Auth Flow (2:40)
"When I click Save, since I'm not logged in, it redirects me to Sign In.
Let me create a new account. [fill in form, submit] — After registering, it
automatically signs me in. Now I can save colleges and see them in the Saved page."

---

## ⏱ Architecture Walkthrough (3:00 – 5:30)

"Now let me open VS Code and walk through the code structure."

### Folder Structure (3:00)
"The project uses Next.js App Router, so every folder inside `src/app` is a route.
API routes live in `src/app/api/`. Pages live alongside them.

The `src/components` folder has three sub-folders:
- `college/` for domain-specific components like CollegeCard and SearchFilters
- `layout/` for Navbar and the SessionProvider wrapper
- `ui/` for generic reusables like LoadingSpinner and Pagination"

### Prisma Schema (3:30)
"Let me open `prisma/schema.prisma`. There are 5 models:

- **User** — stores name, email, hashed password
- **College** — the main entity with all its stats
- **Course** — child of College, stores program details
- **Review** — has a unique constraint on userId + collegeId, so one review per user
- **SavedCollege** — a join table between User and College, also unique per pair

The relationships are: one College has many Courses and Reviews. A User can
save many Colleges through the SavedCollege join table."

### NextAuth Config (4:00)
"Opening `src/lib/auth.ts` — I'm using the CredentialsProvider since students
often don't have Google accounts configured. I use JWT sessions instead of
database sessions because credentials providers work better with JWT.

In the `authorize` callback, I find the user by email, compare the password
hash with bcrypt, and return the user object. The JWT and session callbacks
add the user's ID into the session so API routes can identify who is making the request."

### API Route Example (4:30)
"Let me show `src/app/api/colleges/route.ts`. The GET handler:
1. Parses query params for search, state, type, fees range, rating, page, and limit
2. Dynamically builds a Prisma WHERE clause
3. Runs two queries in parallel with `Promise.all` — one for total count,
   one for the actual data — this is efficient
4. Returns both the college list and pagination metadata

For input validation on mutation routes, I'm using Zod — for example in the
register and review routes — so invalid inputs get a clear 400 error back."

### Save Toggle (5:00)
"The save/unsave in `src/app/api/saved/route.ts` is a toggle pattern.
Rather than separate save and delete endpoints, one POST endpoint checks if
the record exists. If yes, delete it. If no, create it. This keeps the
front end simple — just one call."

---

## ⏱ Key Decisions & Trade-offs (5:30 – 7:00)

"Here are the main architectural decisions I made and why:

**1. Next.js App Router over Pages Router**
App Router lets me colocate API routes and pages. It also supports React
Server Components, though in this project most pages are client components
since they need real-time interactivity.

**2. JWT Sessions instead of Database Sessions**
Credentials provider doesn't work well with database sessions in NextAuth v4.
JWT is simpler and stateless — the user ID is embedded in the token, so
every API route can verify identity without an extra DB lookup.

**3. Prisma ORM over raw SQL**
Prisma generates type-safe query methods, so I can't accidentally write
a wrong column name. The schema file also serves as living documentation
of the database structure. Great for internship reviews.

**4. Neon + Vercel**
Neon is serverless PostgreSQL — it scales to zero, so there's no idle cost.
Vercel is the natural deployment target for Next.js. Both have generous free tiers.

**5. No Redux / Zustand**
State is kept local to each page using useState and useEffect. The app is
simple enough that global state management would be over-engineering."

---

## ⏱ Edge Cases Handled (7:00 – 8:30)

"Let me call out the edge cases I handled:

**Duplicate saves** — The SavedCollege table has a unique constraint on
userId + collegeId. So even if the API is called twice, the second call
either finds the existing record and deletes it (toggle), or the DB constraint
prevents a duplicate.

**Duplicate reviews** — The Review table also has a unique constraint.
I use Prisma's `upsert` so submitting a review again updates it rather
than throwing an error.

**Unauthenticated access to protected routes** — The Saved page checks
`useSession` status. If `unauthenticated`, it redirects to sign-in. API routes
call `getServerSession` and return 401 immediately if not logged in.

**Pagination edge case** — I clamp `limit` at 20 on the server side so a
client can't send `limit=9999` and crash the DB.

**Compare validation** — The compare API rejects requests with fewer than 2
or more than 3 IDs, and also checks that all requested IDs actually exist.

**Empty states & loading states** — Every data-fetching page shows a spinner
while loading, an error message if the API fails, and an empty state component
if there's no data — rather than a blank screen."

---

## ⏱ What I'd Add Next (8:30 – 9:15)

"If I had more time, here's what I'd add:

- **Google OAuth** — NextAuth supports it with just a few config lines
- **Admin dashboard** — to add/edit colleges from the UI instead of the DB
- **Advanced sorting** — sort by fees, rating, placement ascending/descending
- **Email notifications** — send a welcome email on signup using Resend or Nodemailer
- **Image uploads** — college banner images via Cloudinary or Vercel Blob"

---

## ⏱ Closing (9:15 – 9:45)

"To summarize: CollegeDiscover is a production-ready full-stack Next.js app with:
- JWT-based authentication with NextAuth
- PostgreSQL on Neon via Prisma ORM
- Full CRUD API routes with input validation
- Responsive UI with search, filters, pagination, compare, and reviews
- Deployed on Vercel

Thank you for watching! The code and README are in the repository link below."

---

## 💡 Tips for Recording

- Record at 1920×1080, share the browser tab only (not whole screen)
- Use your system terminal with a large font for code sections
- Keep the Prisma schema and one API file open side by side
- Speak slowly and confidently — you built this, you know it!
- Total target: 7–9 minutes
