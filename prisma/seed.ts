// prisma/seed.ts
// Run this with: npm run db:seed
// It populates the database with sample colleges for testing

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const colleges = [
  {
    name: "Indian Institute of Technology Hyderabad",
    location: "Hyderabad, Telangana",
    state: "Telangana",
    type: "Government",
    established: 2008,
    totalFees: 220000,
    rating: 4.7,
    description:
      "IIT Hyderabad is a premier technical institution offering cutting-edge engineering and science programs. Known for excellent research output and strong industry connections.",
    website: "https://iith.ac.in",
    accreditation: "NAAC A++",
    avgPackage: 18.5,
    highestPackage: 65.0,
    placementRate: 95.2,
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 220000, seats: 60 },
      { name: "B.Tech Electrical Engineering", duration: 4, fees: 220000, seats: 40 },
      { name: "M.Tech AI & ML", duration: 2, fees: 25000, seats: 20 },
    ],
  },
  {
    name: "BITS Pilani Hyderabad Campus",
    location: "Hyderabad, Telangana",
    state: "Telangana",
    type: "Deemed",
    established: 2008,
    totalFees: 580000,
    rating: 4.5,
    description:
      "BITS Pilani Hyderabad is a world-class private university renowned for its flexible curriculum and strong alumni network across the globe.",
    website: "https://www.bits-pilani.ac.in/hyderabad",
    accreditation: "NAAC A",
    avgPackage: 16.2,
    highestPackage: 52.0,
    placementRate: 92.8,
    courses: [
      { name: "B.E. Computer Science", duration: 4, fees: 580000, seats: 80 },
      { name: "B.E. Electronics", duration: 4, fees: 580000, seats: 60 },
      { name: "M.Sc. Physics", duration: 5, fees: 320000, seats: 30 },
    ],
  },
  {
    name: "Osmania University",
    location: "Hyderabad, Telangana",
    state: "Telangana",
    type: "Government",
    established: 1918,
    totalFees: 45000,
    rating: 3.9,
    description:
      "One of the oldest universities in India, Osmania University has produced several notable alumni and offers diverse programs at affordable fees.",
    website: "https://osmania.ac.in",
    accreditation: "NAAC A",
    avgPackage: 5.8,
    highestPackage: 18.0,
    placementRate: 72.0,
    courses: [
      { name: "B.Tech Civil Engineering", duration: 4, fees: 45000, seats: 120 },
      { name: "B.Sc Computer Science", duration: 3, fees: 30000, seats: 80 },
      { name: "MBA", duration: 2, fees: 60000, seats: 60 },
    ],
  },
  {
    name: "Andhra University",
    location: "Visakhapatnam, Andhra Pradesh",
    state: "Andhra Pradesh",
    type: "Government",
    established: 1926,
    totalFees: 55000,
    rating: 3.8,
    description:
      "Andhra University is a prestigious state university in Visakhapatnam offering quality education across engineering, sciences, arts, and management.",
    website: "https://andhrauniversity.edu.in",
    accreditation: "NAAC A+",
    avgPackage: 6.2,
    highestPackage: 22.0,
    placementRate: 68.5,
    courses: [
      { name: "B.Tech Mechanical Engineering", duration: 4, fees: 55000, seats: 90 },
      { name: "B.Tech Computer Science", duration: 4, fees: 55000, seats: 60 },
      { name: "M.Tech VLSI", duration: 2, fees: 40000, seats: 25 },
    ],
  },
  {
    name: "VIT-AP University",
    location: "Amaravati, Andhra Pradesh",
    state: "Andhra Pradesh",
    type: "Private",
    established: 2017,
    totalFees: 195000,
    rating: 4.2,
    description:
      "VIT-AP is a new-generation private university focused on innovation and research with modern infrastructure and strong industry partnerships.",
    website: "https://vitap.ac.in",
    accreditation: "NAAC A",
    avgPackage: 8.4,
    highestPackage: 32.0,
    placementRate: 85.0,
    courses: [
      { name: "B.Tech CSE (AI & ML)", duration: 4, fees: 195000, seats: 120 },
      { name: "B.Tech Data Science", duration: 4, fees: 195000, seats: 60 },
      { name: "BCA", duration: 3, fees: 95000, seats: 80 },
    ],
  },
  {
    name: "SRM University AP",
    location: "Amaravati, Andhra Pradesh",
    state: "Andhra Pradesh",
    type: "Private",
    established: 2017,
    totalFees: 210000,
    rating: 4.1,
    description:
      "SRM University AP is a vibrant campus university with focus on research, entrepreneurship, and global collaborations.",
    website: "https://srmap.edu.in",
    accreditation: "NAAC A+",
    avgPackage: 7.9,
    highestPackage: 28.5,
    placementRate: 83.2,
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 210000, seats: 150 },
      { name: "B.Tech ECE", duration: 4, fees: 210000, seats: 90 },
      { name: "M.Tech Robotics", duration: 2, fees: 150000, seats: 20 },
    ],
  },
  {
    name: "IIT Tirupati",
    location: "Tirupati, Andhra Pradesh",
    state: "Andhra Pradesh",
    type: "Government",
    established: 2015,
    totalFees: 200000,
    rating: 4.6,
    description:
      "A young IIT with strong research culture and world-class faculty, IIT Tirupati is rapidly building a reputation for excellence.",
    website: "https://iittp.ac.in",
    accreditation: "NAAC A++",
    avgPackage: 17.0,
    highestPackage: 58.0,
    placementRate: 94.0,
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 200000, seats: 30 },
      { name: "B.Tech Chemical Engineering", duration: 4, fees: 200000, seats: 25 },
    ],
  },
  {
    name: "JNTU Anantapur",
    location: "Anantapur, Andhra Pradesh",
    state: "Andhra Pradesh",
    type: "Government",
    established: 2008,
    totalFees: 50000,
    rating: 3.6,
    description:
      "JNTU Anantapur is a state technical university offering affordable engineering and technology programs across multiple disciplines.",
    website: "https://jntuaacep.ac.in",
    accreditation: "NAAC B+",
    avgPackage: 4.5,
    highestPackage: 12.0,
    placementRate: 60.0,
    courses: [
      { name: "B.Tech CSE", duration: 4, fees: 50000, seats: 120 },
      { name: "B.Tech EEE", duration: 4, fees: 50000, seats: 60 },
    ],
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (for re-seeding)
  await prisma.savedCollege.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();

  for (const collegeData of colleges) {
    const { courses, ...collegeFields } = collegeData;

    const college = await prisma.college.create({
      data: {
        ...collegeFields,
        courses: {
          create: courses,
        },
      },
    });

    console.log(`✅ Created: ${college.name}`);
  }

  console.log("\n🎉 Seed complete! Database has", colleges.length, "colleges.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
