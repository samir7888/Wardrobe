import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { Category } from 'generated/prisma';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(Category)
  category: Category;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  season?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
