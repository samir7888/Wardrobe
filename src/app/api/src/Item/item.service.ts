import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateItemDto } from './dtos/createItem.dto';
import { UpdateItemDto } from './dtos/updateItem.dto';
import { QueryItemDto } from './dtos/queryItem.dto';
import { WardrobeItem } from 'generated/prisma';

export interface ItemWithImageUrl extends Omit<WardrobeItem, 'cloudId'> {
  imageUrl: string;
  thumbnailUrl: string;
}

export interface PaginatedItems {
  items: ItemWithImageUrl[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ItemService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async createItem(
    userId: string,
    createItemDto: CreateItemDto,
    file: Express.Multer.File,
  ): Promise<ItemWithImageUrl> {
    // Upload image to Cloudinary
    const uploadResult = await this.cloudinary.uploadImage(file, 'wardrobe');

    // Create item in database
    const item = await this.prisma.wardrobeItem.create({
      data: {
        ...createItemDto,
        userId,
        imageUrl: uploadResult.secure_url,
        cloudId: uploadResult.public_id,
      },
    });

    return this.formatItemWithUrls(item);
  }

  async findAllItems(
    userId: string,
    queryDto: QueryItemDto,
  ): Promise<PaginatedItems> {
    const { category, color, season, search, page = 1, limit = 20 } = queryDto;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    if (category) where.category = category;
    if (color) where.color = { contains: color, mode: 'insensitive' };
    if (season) where.season = season;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get items and total count
    const [items, total] = await Promise.all([
      this.prisma.wardrobeItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.wardrobeItem.count({ where }),
    ]);

    const formattedItems = items.map((item) => this.formatItemWithUrls(item));

    return {
      items: formattedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneItem(userId: string, itemId: string): Promise<ItemWithImageUrl> {
    const item = await this.prisma.wardrobeItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return this.formatItemWithUrls(item);
  }

  async updateItem(
    userId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
    file?: Express.Multer.File,
  ): Promise<ItemWithImageUrl> {
    // Check if item exists and belongs to user
    const existingItem = await this.prisma.wardrobeItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!existingItem) {
      throw new NotFoundException('Item not found');
    }

    let updateData: any = { ...updateItemDto };

    // If new image is provided, upload it and delete the old one
    if (file) {
      const uploadResult = await this.cloudinary.uploadImage(file, 'wardrobe');

      // Delete old image from Cloudinary
      if (existingItem.cloudId) {
        await this.cloudinary.deleteImage(existingItem.cloudId);
      }

      updateData.imageUrl = uploadResult.secure_url;
      updateData.cloudId = uploadResult.public_id;
    }

    const updatedItem = await this.prisma.wardrobeItem.update({
      where: { id: itemId },
      data: updateData,
    });

    return this.formatItemWithUrls(updatedItem);
  }

  async deleteItem(userId: string, itemId: string): Promise<void> {
    // Check if item exists and belongs to user
    const item = await this.prisma.wardrobeItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Delete image from Cloudinary
    if (item.cloudId) {
      await this.cloudinary.deleteImage(item.cloudId);
    }

    // Delete item from database
    await this.prisma.wardrobeItem.delete({
      where: { id: itemId },
    });
  }

  async getItemsByCategory(
    userId: string,
    category: string,
  ): Promise<ItemWithImageUrl[]> {
    const items = await this.prisma.wardrobeItem.findMany({
      where: { userId, category: category as any },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => this.formatItemWithUrls(item));
  }

  private formatItemWithUrls(item: WardrobeItem): ItemWithImageUrl {
    return {
      id: item.id,
      userId: item.userId,
      title: item.title,
      category: item.category,
      color: item.color,
      season: item.season,
      notes: item.notes,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      imageUrl: item.imageUrl,
      thumbnailUrl: this.cloudinary.getImageUrl(
        item.cloudId,
        'w_300,h_300,c_fill',
      ),
    };
  }
}
