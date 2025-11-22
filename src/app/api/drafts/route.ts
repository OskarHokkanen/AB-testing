import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Retrieve draft design choices for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    console.log("[API Draft GET] Request for studentId:", studentId);

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 },
      );
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
    });

    if (!student) {
      console.log("[API Draft GET] Student not found:", studentId);
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 },
      );
    }

    const draftDesignChoices = (student as any).draftDesignChoices
      ? JSON.parse((student as any).draftDesignChoices)
      : [];

    console.log(
      "[API Draft GET] Returning",
      draftDesignChoices.length,
      "design choices for student:",
      studentId,
    );

    return NextResponse.json({
      success: true,
      draftDesignChoices,
    });
  } catch (error) {
    console.error("[API Draft GET] Error fetching draft:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch draft" },
      { status: 500 },
    );
  }
}

// POST: Save draft design choices for a student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, designChoices } = body;

    console.log(
      "[API Draft POST] Saving draft for studentId:",
      studentId,
      "with",
      designChoices?.length || 0,
      "design choices",
    );

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 },
      );
    }

    if (!Array.isArray(designChoices)) {
      console.log("[API Draft POST] Invalid design choices format");
      return NextResponse.json(
        { success: false, error: "Design choices must be an array" },
        { status: 400 },
      );
    }

    // Update the student's draft
    await prisma.student.update({
      where: { studentId },
      data: {
        draftDesignChoices: JSON.stringify(designChoices),
      } as any,
    });

    console.log("[API Draft POST] Successfully saved draft for:", studentId);

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully",
    });
  } catch (error) {
    console.error("[API Draft POST] Error saving draft:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save draft" },
      { status: 500 },
    );
  }
}

// DELETE: Clear draft design choices for a student
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    console.log("[API Draft DELETE] Clearing draft for studentId:", studentId);

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 },
      );
    }

    await prisma.student.update({
      where: { studentId },
      data: {
        draftDesignChoices: null,
      } as any,
    });

    console.log(
      "[API Draft DELETE] Successfully cleared draft for:",
      studentId,
    );

    return NextResponse.json({
      success: true,
      message: "Draft cleared successfully",
    });
  } catch (error) {
    console.error("[API Draft DELETE] Error clearing draft:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear draft" },
      { status: 500 },
    );
  }
}
