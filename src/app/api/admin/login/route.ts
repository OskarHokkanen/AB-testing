import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      console.log(`[ADMIN AUTH] Failed login attempt - Invalid username: ${username}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      console.log(`[ADMIN AUTH] Failed login attempt - Invalid password for username: ${username}`);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log(`[ADMIN AUTH] Admin logged in: ${username}`);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    });
  } catch (error) {
    console.error("[ADMIN AUTH] Admin login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
