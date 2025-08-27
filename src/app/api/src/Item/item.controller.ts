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

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
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
  async findAll(@Req() req: any, @Query() queryDto: QueryItemDto) {
    return this.itemService.findAllItems(req.user.id, queryDto);
  }

  @Get('category/:category')
  async findByCategory(@Req() req: any, @Param('category') category: string) {
    return this.itemService.getItemsByCategory(req.user.id, category);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.itemService.findOneItem(req.user.id, id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
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
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.itemService.deleteItem(req.user.id, id);
    return { message: 'Item deleted successfully' };
  }
}
