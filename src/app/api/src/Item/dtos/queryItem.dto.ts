import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { Category } from 'generated/prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryItemDto {
  @ApiPropertyOptional({
    description: 'Filter by item category',
    enum: Category,
    example: 'TOPS',
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({
    description: 'Filter by item color',
    example: 'blue',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Filter by season',
    example: 'summer',
  })
  @IsOptional()
  @IsString()
  season?: string;

  @ApiPropertyOptional({
    description: 'Search items by name or description',
    example: 'cotton shirt',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
