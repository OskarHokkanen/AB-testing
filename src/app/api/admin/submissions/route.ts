import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        student: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      submissions: submissions.map((s) => ({
        id: s.id,
        studentId: s.studentId,
        studentName: s.student.name,
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

export async function DELETE(request: Request) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    // Get submission details before deleting (for screenshot cleanup)
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Delete the submission from database
    await prisma.submission.delete({
      where: { id: submissionId },
    });

    // Clean up screenshot file if it exists
    if (submission.screenshotPath) {
      try {
        const screenshotFullPath = path.join(
          process.cwd(),
          "public",
          submission.screenshotPath
        );
        if (fs.existsSync(screenshotFullPath)) {
          fs.unlinkSync(screenshotFullPath);
        }
      } catch (fileError) {
        console.error("Failed to delete screenshot file:", fileError);
        // Continue even if file deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Delete submission error:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
