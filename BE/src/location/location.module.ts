import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Module } from '@nestjs/common';
import { DeviceModule } from 'src/device/device.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    DeviceModule,
    FileUploadModule,
    
  ],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
