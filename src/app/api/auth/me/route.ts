import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await AuthService.getUserFromToken(request);

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
