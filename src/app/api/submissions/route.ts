import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { calculateMetrics, DesignChoice } from "@/lib/metrics";
import { generateReport } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { studentId, designChoices } = await request.json();

    if (!studentId || !designChoices || !Array.isArray(designChoices)) {
      return NextResponse.json(
        { error: "Student ID and design choices are required" },
        { status: 400 },
      );
    }

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      console.log(`[SUBMISSION] Failed submission attempt - Student not found: ${studentId}`);
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Check if student has reached submission limit (max 6)
    const submissionCount = (student as any).submissionCount || 0;
    if (submissionCount >= 6) {
      console.log(`[SUBMISSION] Failed submission attempt - Max limit reached for student: ${studentId} (${student.name || 'No name'})`);
      return NextResponse.json(
        {
          error:
            "Maximum submission limit reached. You have used all 6 attempts.",
        },
        { status: 403 },
      );
    }

    console.log(`[SUBMISSION] Creating submission for student: ${studentId} (${student.name || 'No name'}) - Attempt ${submissionCount + 1}/6`);

    // Calculate metrics
    const metrics = calculateMetrics(designChoices as DesignChoice[]);

    // Generate AI report (non-blocking - proceed even if it fails)
    let aiReport: string | null = null;
    try {
      aiReport = await generateReport(designChoices as DesignChoice[], metrics);
    } catch (error) {
      console.error(`[SUBMISSION] AI report generation failed for student ${studentId}:`, error);
      // Set to null so the user can still see results without the report
      aiReport = null;
    }

    // Create submission and increment submission count in a transaction
    const [submission] = await prisma.$transaction([
      prisma.submission.create({
        data: {
          studentId,
          designChoices: JSON.stringify(designChoices),
          conversionRate: metrics.conversionRate,
          bounceRate: metrics.bounceRate,
          clickThroughRate: metrics.clickThroughRate,
          avgTimeOnPage: metrics.avgTimeOnPage,
          cartAbandonmentRate: metrics.cartAbandonmentRate,
          aiReport,
        },
      }),
      prisma.student.update({
        where: { studentId },
        data: { submissionCount: { increment: 1 } } as any,
      }),
    ]);

    console.log(`[SUBMISSION] Successfully created submission ${submission.id} for student: ${studentId} - Conversion Rate: ${metrics.conversionRate}%, ${6 - (submissionCount + 1)} attempts remaining`);

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        designChoices: JSON.parse(submission.designChoices),
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
      },
      remainingAttempts: 6 - (submissionCount + 1),
    });
  } catch (error) {
    console.error("[SUBMISSION] Submission error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 },
    );
  }

  try {
    const submissions = await prisma.submission.findMany({
      where: { studentId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      submissions: submissions.map((s) => ({
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
    });
  } catch (error) {
    console.error("[SUBMISSION] Get submissions error:", error);
    return NextResponse.json(
      { error: "Failed to get submissions" },
      { status: 500 },
    );
  }
}