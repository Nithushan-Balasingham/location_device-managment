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
  BadRequestException,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { RtGuard } from '../auth/common/guards/rt.guard';
import { Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: undefined, 
    }),
  )
  async createDevice(
    @Body() dto: CreateDeviceDto & { locationId: number },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      if (!dto.locationId) {
        throw new BadRequestException('Location ID is required');
      }

      const existingDevice = await this.deviceService.findBySerialNumber(
        dto.serialNumber,
      );
      if (existingDevice) {
        throw new BadRequestException(
          `A device with serial number '${dto.serialNumber}' already exists.`,
        );
      }

      if (file) {
        const filename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join('uploads/devices', filename);

        fs.writeFileSync(filePath, file.buffer);

        dto.image = `uploads/devices/${filename}`;
      }

      return await this.deviceService.createWithLocation(dto);
    } catch (error) {
      console.error('Error creating device:', error);

      if (file && dto.image) {
        const filePath = path.join(process.cwd(), dto.image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      throw error;
    }
  }
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
