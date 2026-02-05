import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    console.log("[ADMIN] Fetching all submissions");
    const submissions = await prisma.submission.findMany({
      include: {
        student: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`[ADMIN] Successfully fetched ${submissions.length} submissions`);

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
    console.error("[ADMIN] Get submissions error:", error);
    return NextResponse.json(
      { error: "Failed to get submissions" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { submissionId } = await request.json();

    console.log(`[ADMIN] Deleting submission: ${submissionId}`);

    if (!submissionId) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 }
      );
    }

    // Get submission details before deleting (for screenshot cleanup)
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
        { status: 404 }
      );
    }

    // Delete the submission from database and decrement submission count
    await prisma.$transaction([
      prisma.submission.delete({
        where: { id: submissionId },
      }),
      prisma.student.update({
        where: { studentId: submission.studentId },
        data: {
          submissionCount: {
            decrement: 1,
          },
        },
      }),
    ]);

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

    console.log(`[ADMIN] Successfully deleted submission ${submissionId} for student: ${submission.studentId} (${submission.student.name || 'No name'})`);

    return NextResponse.json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("[ADMIN] Delete submission error:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
