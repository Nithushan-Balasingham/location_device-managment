import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { Location } from '../location/entities/location.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Device, Location])],
  providers: [DeviceService],
})
export class DeviceModule {}
