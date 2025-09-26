import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  static async verifyPassword(
    hashedPassword: string,
    password: string
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }

  static async generateTokens(
    userId: string,
    email: string,
    name: string
  ): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      name,
    };

    const [accessToken, refreshToken] = await Promise.all([
      // Access token - 15 minutes
      jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "15m" }),
      // Refresh token - 7 days
      jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  static async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    } catch {
      throw new Error("Invalid access token");
    }
  }

  static async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
    } catch {
      throw new Error("Invalid refresh token");
    }
  }

  static async getUserFromToken(request: NextRequest) {
    try {
      const authHeader = request.headers.get("authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
      }

      const token = authHeader.substring(7);
      const payload = await this.verifyAccessToken(token);

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch {
      throw new Error("Unauthorized");
    }
  }
}
