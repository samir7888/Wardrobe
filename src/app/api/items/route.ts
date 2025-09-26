import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";
import { CloudinaryService } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  try {
    const user = await AuthService.getUserFromToken(request);
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const color = searchParams.get("color");
    const season = searchParams.get("season");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, any> = { userId: user.id };

    if (category) where.category = category;
    if (color) where.color = { contains: color, mode: "insensitive" };
    if (season) where.season = season;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get items and total count
    const [items, total] = await Promise.all([
      prisma.wardrobeItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.wardrobeItem.count({ where }),
    ]);

    const formattedItems = items.map((item) => ({
      ...item,
      thumbnailUrl: CloudinaryService.getImageUrl(
        item.cloudId,
        "w_300,h_300,c_fill"
      ),
    }));

    return NextResponse.json({
      items: formattedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get items error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await AuthService.getUserFromToken(request);
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const color = formData.get("color") as string;
    const season = formData.get("season") as string;
    const notes = formData.get("notes") as string;
    const image = formData.get("image") as File;

    // Validate required fields
    if (!title || !category || !image) {
      return NextResponse.json(
        { error: "Title, category, and image are required" },
        { status: 400 }
      );
    }

    // Validate file size and type
    if (image.size > 5 * 1024 * 1024) {
      // 5MB
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    if (!image.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Upload image to Cloudinary
    const uploadResult = await CloudinaryService.uploadImage(
      buffer,
      "wardrobe"
    );

    // Create item in database
    const item = await prisma.wardrobeItem.create({
      data: {
        title,
        category: category as
          | "TOP"
          | "BOTTOM"
          | "OUTERWEAR"
          | "FOOTWEAR"
          | "ACCESSORY",
        color: color || null,
        season: season || null,
        notes: notes || null,
        userId: user.id,
        imageUrl: uploadResult.secure_url,
        cloudId: uploadResult.public_id,
      },
    });

    const formattedItem = {
      ...item,
      thumbnailUrl: CloudinaryService.getImageUrl(
        item.cloudId,
        "w_300,h_300,c_fill"
      ),
    };

    return NextResponse.json(formattedItem, { status: 201 });
  } catch (error) {
    console.error("Create item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
