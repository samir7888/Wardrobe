import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemService } from './item.service';
import { CreateItemDto } from './dtos/createItem.dto';
import { UpdateItemDto } from './dtos/updateItem.dto';
import { QueryItemDto } from './dtos/queryItem.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ItemDto, PaginatedItemsDto } from './dtos/item-response.dto';

@ApiTags('Items')
@Controller('items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Create a new wardrobe item with image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Blue Cotton Shirt' },
        category: {
          type: 'string',
          enum: ['TOPS', 'BOTTOMS', 'SHOES', 'ACCESSORIES', 'OUTERWEAR'],
          example: 'TOPS',
        },
        color: { type: 'string', example: 'blue' },
        season: { type: 'string', example: 'summer' },
        notes: { type: 'string', example: 'Comfortable for casual wear' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Item image (max 5MB, jpeg/jpg/png/webp)',
        },
      },
      required: ['title', 'category', 'image'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Item successfully created',
    type: ItemDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Req() req: any,
    @Body() createItemDto: CreateItemDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.itemService.createItem(req.user.id, createItemDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all items with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Items retrieved successfully',
    type: PaginatedItemsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: any, @Query() queryDto: QueryItemDto) {
    return this.itemService.findAllItems(req.user.id, queryDto);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get items by category' })
  @ApiParam({
    name: 'category',
    description: 'Item category',
    enum: ['TOPS', 'BOTTOMS', 'SHOES', 'ACCESSORIES', 'OUTERWEAR'],
    example: 'TOPS',
  })
  @ApiResponse({
    status: 200,
    description: 'Items retrieved successfully',
    type: [ItemDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByCategory(@Req() req: any, @Param('category') category: string) {
    return this.itemService.getItemsByCategory(req.user.id, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific item by ID' })
  @ApiParam({
    name: 'id',
    description: 'Item ID',
    example: 'clm123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Item retrieved successfully',
    type: ItemDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.itemService.findOneItem(req.user.id, id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update an existing item' })
  @ApiParam({
    name: 'id',
    description: 'Item ID',
    example: 'clm123456789',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Blue Cotton Shirt' },
        category: {
          type: 'string',
          enum: ['TOPS', 'BOTTOMS', 'SHOES', 'ACCESSORIES', 'OUTERWEAR'],
          example: 'TOPS',
        },
        color: { type: 'string', example: 'blue' },
        season: { type: 'string', example: 'summer' },
        notes: { type: 'string', example: 'Comfortable for casual wear' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Item image (optional, max 5MB, jpeg/jpg/png/webp)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Item successfully updated',
    type: ItemDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /^image\/(jpeg|jpg|png|webp)$/ }),
        ],
        fileIsRequired: false, // Image is optional for updates
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.itemService.updateItem(req.user.id, id, updateItemDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({
    name: 'id',
    description: 'Item ID',
    example: 'clm123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Item successfully deleted',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Item deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.itemService.deleteItem(req.user.id, id);
    return { message: 'Item deleted successfully' };
  }
}
