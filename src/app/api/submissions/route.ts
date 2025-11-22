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
        { status: 400 }
      );
    }

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Calculate metrics
    const metrics = calculateMetrics(designChoices as DesignChoice[]);

    // Generate AI report
    let aiReport: string | null = null;
    try {
      aiReport = await generateReport(designChoices as DesignChoice[], metrics);
    } catch (error) {
      console.error("AI report generation failed:", error);
      aiReport = "AI report generation failed. Please try again later.";
    }

    // Create submission
    const submission = await prisma.submission.create({
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
    });

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
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID is required" },
      { status: 400 }
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
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { error: "Failed to get submissions" },
      { status: 500 }
    );
  }
}
