import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";
import { CloudinaryService } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const user = await AuthService.getUserFromToken(request);
    const { category } = await params;

    const items = await prisma.wardrobeItem.findMany({
      where: {
        userId: user.id,
        category: category as
          | "TOP"
          | "BOTTOM"
          | "OUTERWEAR"
          | "FOOTWEAR"
          | "ACCESSORY",
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedItems = items.map((item) => ({
      ...item,
      thumbnailUrl: CloudinaryService.getImageUrl(
        item.cloudId,
        "w_300,h_300,c_fill"
      ),
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("Get items by category error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
