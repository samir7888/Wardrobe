import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { Category } from 'generated/prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    description: 'Item title/name',
    example: 'Blue Cotton Shirt',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Item category',
    enum: Category,
    example: 'TOPS',
  })
  @IsEnum(Category)
  category: Category;

  @ApiPropertyOptional({
    description: 'Item color',
    example: 'blue',
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    description: 'Season when item is typically worn',
    example: 'summer',
  })
  @IsString()
  @IsOptional()
  season?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the item',
    example: 'Comfortable for casual wear',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
