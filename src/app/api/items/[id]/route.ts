import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";
import { CloudinaryService } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await AuthService.getUserFromToken(request);
    const { id } = await params;

    const item = await prisma.wardrobeItem.findFirst({
      where: { id, userId: user.id },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const formattedItem = {
      ...item,
      thumbnailUrl: CloudinaryService.getImageUrl(
        item.cloudId,
        "w_300,h_300,c_fill"
      ),
    };

    return NextResponse.json(formattedItem);
  } catch (error) {
    console.error("Get item error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await AuthService.getUserFromToken(request);
    const { id } = await params;
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const color = formData.get("color") as string;
    const season = formData.get("season") as string;
    const notes = formData.get("notes") as string;
    const image = formData.get("image") as File | null;

    // Check if item exists and belongs to user
    const existingItem = await prisma.wardrobeItem.findFirst({
      where: { id, userId: user.id },
    });

    if (!existingItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};

    if (title) updateData.title = title;
    if (category) updateData.category = category;
    if (color !== undefined) updateData.color = color || null;
    if (season !== undefined) updateData.season = season || null;
    if (notes !== undefined) updateData.notes = notes || null;

    // If new image is provided, upload it and delete the old one
    if (image && image.size > 0) {
      // Validate file
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

      // Upload new image
      const uploadResult = await CloudinaryService.uploadImage(
        buffer,
        "wardrobe"
      );

      // Delete old image from Cloudinary
      if (existingItem.cloudId) {
        await CloudinaryService.deleteImage(existingItem.cloudId);
      }

      updateData.imageUrl = uploadResult.secure_url;
      updateData.cloudId = uploadResult.public_id;
    }

    const updatedItem = await prisma.wardrobeItem.update({
      where: { id },
      data: updateData,
    });

    const formattedItem = {
      ...updatedItem,
      thumbnailUrl: CloudinaryService.getImageUrl(
        updatedItem.cloudId,
        "w_300,h_300,c_fill"
      ),
    };

    return NextResponse.json(formattedItem);
  } catch (error) {
    console.error("Update item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await AuthService.getUserFromToken(request);
    const { id } = await params;

    // Check if item exists and belongs to user
    const item = await prisma.wardrobeItem.findFirst({
      where: { id, userId: user.id },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (item.cloudId) {
      await CloudinaryService.deleteImage(item.cloudId);
    }

    // Delete item from database
    await prisma.wardrobeItem.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
