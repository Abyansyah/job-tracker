import { db } from "./drizzle";
import {
  locations,
  statuses,
  applicationSources,
} from "./schema";
import "dotenv/config";

// Data untuk seeding
const locationsData = [
  { name: "On-site", color: "#3b82f6" }, // Blue
  { name: "Remote", color: "#22c55e" },  // Green
  { name: "Hybrid", color: "#8b5cf6" },  // Purple
];

const statusesData = [
  { name: "Applied", color: "#6b7280" },   // Gray
  { name: "In Review", color: "#eab308" },// Yellow
  { name: "Interview", color: "#3b82f6" },// Blue
  { name: "Offered", color: "#22c55e" },  // Green
  { name: "Hired", color: "#84cc16" },     // Lime
  { name: "Rejected", color: "#ef4444" }, // Red
  { name: "Ghosted", color: "#f97316" }, // Orange
];

const applicationSourcesData = [
  { name: "Website", color: "#f97316" },  // Orange
  { name: "Email", color: "#ef4444" },    // Red
  { name: "LinkedIn", color: "#0ea5e9" }, // Sky Blue
  { name: "Jobstreet", color: "#06b6d4" },// Cyan
];

async function seed() {
  console.log("🚀 Seeding started...");

  // Mengosongkan tabel sebelum seeding (opsional, tapi disarankan)
  await db.delete(locations);
  await db.delete(statuses);
  await db.delete(applicationSources);
  console.log("🗑️  Tables cleared.");

  // Memasukkan data baru
  await db.insert(locations).values(locationsData);
  console.log("✅ Locations seeded.");

  await db.insert(statuses).values(statusesData);
  console.log("✅ Statuses seeded.");

  await db.insert(applicationSources).values(applicationSourcesData);
  console.log("✅ Application Sources seeded.");

  console.log("🎉 Seeding finished successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});