import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './entities/device.entity';
import { Location } from '../location/entities/location.entity';
import { LocationService } from '../location/location.service';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Location])],
  controllers: [DeviceController],
  providers: [DeviceService, LocationService],
  exports: [DeviceService],
})
export class DeviceModule {}
