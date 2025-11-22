import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("Created admin user: admin / admin123");

  // Create test students
  const testStudents = [
    { studentId: "student001", name: "Alice Johnson" },
    { studentId: "student002", name: "Bob Smith" },
    { studentId: "student003", name: "Charlie Brown" },
    { studentId: "cs101-001", name: null },
    { studentId: "cs101-002", name: null },
    { studentId: "cs101-003", name: null },
  ];

  for (const student of testStudents) {
    await prisma.student.upsert({
      where: { studentId: student.studentId },
      update: {},
      create: student,
    });
  }
  console.log(`Created ${testStudents.length} test students`);

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
