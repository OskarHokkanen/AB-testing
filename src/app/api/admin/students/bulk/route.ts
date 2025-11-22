import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { count, namePrefix, startNumber } = await request.json();

    if (!count || typeof count !== "number" || count < 1 || count > 100) {
      return NextResponse.json(
        { error: "Count must be a number between 1 and 100" },
        { status: 400 }
      );
    }

    const start = typeof startNumber === "number" ? startNumber : 1;
    const createdStudents = [];

    for (let i = 0; i < count; i++) {
      // Generate a random GUID
      const guid = crypto.randomUUID();

      // Generate name if prefix is provided
      const name = namePrefix ? `${namePrefix} ${start + i}` : null;

      try {
        const student = await prisma.student.create({
          data: {
            studentId: guid,
            name,
          },
        });

        createdStudents.push({
          id: student.id,
          studentId: student.studentId,
          name: student.name,
          createdAt: student.createdAt,
          submissionCount: 0,
          submissions: [],
        });
      } catch (error) {
        // Skip if GUID already exists (extremely unlikely)
        console.error("Failed to create student with GUID:", guid, error);
      }
    }

    return NextResponse.json({
      success: true,
      students: createdStudents,
      count: createdStudents.length,
    });
  } catch (error) {
    console.error("Bulk create students error:", error);
    return NextResponse.json(
      { error: "Failed to create students" },
      { status: 500 }
    );
  }
}
