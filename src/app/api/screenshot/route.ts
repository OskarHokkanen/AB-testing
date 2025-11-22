import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { submissionId, html } = await request.json();

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
    await mkdir(screenshotsDir, { recursive: true });

    // Save screenshot
    const filename = `${submissionId}-${Date.now()}.png`;
    const filepath = path.join(screenshotsDir, filename);
    await writeFile(filepath, screenshot);

    // Update submission with screenshot path
    await prisma.submission.update({
      where: { id: submissionId },
      data: { screenshotPath: `/screenshots/${filename}` },
    });

    return NextResponse.json({
      success: true,
      screenshotPath: `/screenshots/${filename}`,
    });
  } catch (error) {
    console.error("Screenshot error:", error);
    return NextResponse.json(
      { error: "Failed to generate screenshot" },
      { status: 500 },
    );
  }
}
