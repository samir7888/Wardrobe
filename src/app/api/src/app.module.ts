import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ItemModule } from './Item/item.module';

@Module({
  imports: [AuthModule, PrismaModule, CloudinaryModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
