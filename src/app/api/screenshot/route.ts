import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { submissionId, html } = await request.json();

    console.log(`[SCREENSHOT] Generating screenshot for submission: ${submissionId}`);

    if (!submissionId || !html) {
      return NextResponse.json(
        { error: "Submission ID and HTML are required" },
        { status: 400 },
      );
    }

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1080 });

    // Set the HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Take screenshot - fullPage captures entire page content
    const screenshot = await page.screenshot({
      type: "png",
      fullPage: true,
    });
    await browser.close();

    // Ensure screenshots directory exists
    const screenshotsDir = path.join(process.cwd(), "public", "screenshots");
    try {
      await mkdir(screenshotsDir, { recursive: true });
    } catch (mkdirError) {
      console.error("[SCREENSHOT] Error creating screenshots directory:", mkdirError);
      // Continue anyway - directory might already exist
    }

    // Save screenshot
    const filename = `${submissionId}-${Date.now()}.png`;
    const filepath = path.join(screenshotsDir, filename);
    try {
      await writeFile(filepath, screenshot);
    } catch (writeError) {
      console.error("[SCREENSHOT] Error writing screenshot file:", writeError);
      throw new Error(`Failed to save screenshot: ${writeError instanceof Error ? writeError.message : String(writeError)}`);
    }

    // Update submission with screenshot path (use API route for serving)
    await prisma.submission.update({
      where: { id: submissionId },
      data: { screenshotPath: `/api/screenshots/${filename}` },
    });

    console.log(`[SCREENSHOT] Successfully generated screenshot for submission: ${submissionId} - ${filename}`);

    return NextResponse.json({
      success: true,
      screenshotPath: `/api/screenshots/${filename}`,
    });
  } catch (error) {
    console.error("[SCREENSHOT] Screenshot error:", error);
    return NextResponse.json(
      { error: "Failed to generate screenshot" },
      { status: 500 },
    );
  }
}
