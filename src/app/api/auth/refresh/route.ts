import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      console.log("No refresh token found in cookies");
      const response = NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
      // Clear any existing refresh token cookie
      response.cookies.delete("refreshToken");
      return response;
    }

    // Verify refresh token
    const payload = await AuthService.verifyRefreshToken(refreshToken);

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      console.log("User not found for refresh token");
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
      // Clear invalid refresh token cookie
      response.cookies.delete("refreshToken");
      return response;
    }

    // Generate new tokens
    const tokens = await AuthService.generateTokens(
      user.id,
      user.email,
      user.name
    );

    // Create response
    const response = NextResponse.json({
      accessToken: tokens.accessToken,
      message: "Tokens refreshed",
    });

    // Set new refresh token as httpOnly cookie
    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    const response = NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
    // Clear invalid refresh token cookie
    response.cookies.delete("refreshToken");
    return response;
  }
}
