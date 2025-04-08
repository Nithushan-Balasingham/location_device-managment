import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { RtGuard } from '../auth/common/guards/rt.guard';
import { Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  // @Post()
  // @UseGuards(RtGuard)
  // create(@Body() createDeviceDto: CreateDeviceDto) {
  //   return this.deviceService.create(createDeviceDto);
  // }

  @Get()
  findAll() {
    return this.deviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: path.join(__dirname, '../../uploads/devices'),
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDeviceDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<any> {
    console.log(`Updating device with ID: ${id}`); 
    console.log('Uploaded file:', file); 
    return this.deviceService.update(id, dto, file);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    console.log(`Deleting device with ID: ${id}`);
    return this.deviceService.delete(id);
  }
}
