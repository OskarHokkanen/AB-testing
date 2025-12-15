import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { studentId } = await request.json();

    if (!studentId || typeof studentId !== "string") {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 },
      );
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { studentId },
      include: {
        submissions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student ID not found. Please contact your instructor." },
        { status: 401 },
      );
    }

    const submissionCount = (student as any).submissionCount || 0;

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        studentId: student.studentId,
        name: student.name,
        submissionCount: submissionCount,
        remainingAttempts: 6 - submissionCount,
        submissions: student.submissions.map((submission) => ({
          id: submission.id,
          designChoices: submission.designChoices,
          metrics: {
            conversionRate: submission.conversionRate,
            bounceRate: submission.bounceRate,
            clickThroughRate: submission.clickThroughRate,
            avgTimeOnPage: submission.avgTimeOnPage,
            cartAbandonmentRate: submission.cartAbandonmentRate,
          },
          aiReport: submission.aiReport,
          screenshotPath: submission.screenshotPath,
          createdAt: submission.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 },
    );
  }
}
