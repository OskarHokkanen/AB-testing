import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateReport } from "@/lib/ai";
import { DesignChoice } from "@/lib/metrics";

export async function POST(request: Request) {
  try {
    const { submissionId } = await request.json();

    console.log(`[REPORT RETRY] Regenerating AI report for submission: ${submissionId}`);

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 },
      );
    }

    // Fetch the submission
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        student: {
          select: {
            name: true,
            studentId: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    // Parse design choices
    const designChoices = JSON.parse(
      submission.designChoices,
    ) as DesignChoice[];

    // Reconstruct metrics
    const metrics = {
      conversionRate: submission.conversionRate,
      bounceRate: submission.bounceRate,
      clickThroughRate: submission.clickThroughRate,
      avgTimeOnPage: submission.avgTimeOnPage,
      cartAbandonmentRate: submission.cartAbandonmentRate,
    };

    // Generate AI report
    const aiReport = await generateReport(designChoices, metrics);

    // Update submission with new AI report
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: { aiReport },
    });

    console.log(`[REPORT RETRY] Successfully regenerated AI report for submission ${submissionId} (Student: ${submission.studentId})`);

    return NextResponse.json({
      success: true,
      submission: {
        id: updatedSubmission.id,
        designChoices: JSON.parse(updatedSubmission.designChoices),
        metrics: {
          conversionRate: updatedSubmission.conversionRate,
          bounceRate: updatedSubmission.bounceRate,
          clickThroughRate: updatedSubmission.clickThroughRate,
          avgTimeOnPage: updatedSubmission.avgTimeOnPage,
          cartAbandonmentRate: updatedSubmission.cartAbandonmentRate,
        },
        aiReport: updatedSubmission.aiReport,
        screenshotPath: updatedSubmission.screenshotPath,
        createdAt: updatedSubmission.createdAt,
      },
    });
  } catch (error) {
    console.error("[REPORT RETRY] Retry report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI report" },
      { status: 500 },
    );
  }
}
