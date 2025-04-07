import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { DeviceModule } from 'src/device/device.module';
import { Image } from './entities/image.entity';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImageService],
  controllers: [],
  exports: [ImageService],
})
export class ImageModule {}
