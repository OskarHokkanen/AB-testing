import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("[ADMIN] Fetching all students");
    const students = await prisma.student.findMany({
      include: {
        submissions: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`[ADMIN] Successfully fetched ${students.length} students`);

    return NextResponse.json({
      success: true,
      students: students.map((student) => ({
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        createdAt: student.createdAt,
        submissionCount: student.submissions.length,
        submissions: student.submissions.map((s) => ({
          id: s.id,
          designChoices: JSON.parse(s.designChoices),
          metrics: {
            conversionRate: s.conversionRate,
            bounceRate: s.bounceRate,
            clickThroughRate: s.clickThroughRate,
            avgTimeOnPage: s.avgTimeOnPage,
            cartAbandonmentRate: s.cartAbandonmentRate,
          },
          aiReport: s.aiReport,
          screenshotPath: s.screenshotPath,
          createdAt: s.createdAt,
        })),
      })),
    });
  } catch (error) {
    console.error("[ADMIN] Get students error:", error);
    return NextResponse.json(
      { error: "Failed to get students" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { studentId, name } = await request.json();

    console.log(`[ADMIN] Creating student: ${studentId} (${name || 'No name'})`);

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Check if student already exists
    const existing = await prisma.student.findUnique({
      where: { studentId },
    });

    if (existing) {
      console.log(`[ADMIN] Failed to create student - Student ID already exists: ${studentId}`);
      return NextResponse.json(
        { error: "Student ID already exists" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        studentId,
        name: name || null,
      },
    });

    console.log(`[ADMIN] Successfully created student: ${studentId} (${name || 'No name'})`);

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        createdAt: student.createdAt,
        submissionCount: 0,
        submissions: [],
      },
    });
  } catch (error) {
    console.error("[ADMIN] Create student error:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    console.log(`[ADMIN] Deleting student: ${studentId}`);

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Delete all submissions first, then the student
    await prisma.submission.deleteMany({
      where: { studentId },
    });

    const student = await prisma.student.findUnique({
      where: { studentId },
      select: { name: true },
    });

    await prisma.student.delete({
      where: { studentId },
    });

    console.log(`[ADMIN] Successfully deleted student: ${studentId} (${student?.name || 'No name'})`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN] Delete student error:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
