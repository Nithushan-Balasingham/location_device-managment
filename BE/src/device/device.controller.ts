import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { RtGuard } from '../auth/common/guards/rt.guard';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @UseGuards(RtGuard)
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @Get()
  findAll() {
    return this.deviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceService.findOne(+id);
  }

  // @Patch(':id')
  // @UseGuards(RtGuard)
  // update(@Param('id') id: number, @Body() updateDeviceDto: UpdateDeviceDto) {
  //   return this.deviceService.update(+id, updateDeviceDto);
  // }

  @Delete(':id')
  @UseGuards(RtGuard)
  remove(@Param('id') id: number) {
    return this.deviceService.remove(+id);
  }
}
