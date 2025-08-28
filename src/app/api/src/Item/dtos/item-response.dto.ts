import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'generated/prisma';

export class ItemDto {
  @ApiProperty({
    description: 'Item ID',
    example: 'clm123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Item title/name',
    example: 'Blue Cotton Shirt',
  })
  title: string;

  @ApiProperty({
    description: 'Item category',
    enum: Category,
    example: 'TOPS',
  })
  category: Category;

  @ApiProperty({
    description: 'Item color',
    example: 'blue',
    nullable: true,
  })
  color: string | null;

  @ApiProperty({
    description: 'Season when item is typically worn',
    example: 'summer',
    nullable: true,
  })
  season: string | null;

  @ApiProperty({
    description: 'Additional notes about the item',
    example: 'Comfortable for casual wear',
    nullable: true,
  })
  notes: string | null;

  @ApiProperty({
    description: 'Item image URL',
    example:
      'https://res.cloudinary.com/example/image/upload/v123456789/item.jpg',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'User ID who owns the item',
    example: 'clm123456789',
  })
  userId: string;

  @ApiProperty({
    description: 'Item creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Item last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginatedItemsDto {
  @ApiProperty({
    description: 'Array of items',
    type: [ItemDto],
  })
  items: ItemDto[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;
}
