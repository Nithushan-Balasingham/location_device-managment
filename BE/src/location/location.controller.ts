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
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { RtGuard } from '../auth/common/guards/rt.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseGuards(RtGuard)
  @UseInterceptors(FilesInterceptor('file'))
  async create(
    @Body() dto: CreateLocationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetCurrentUserId() userId: number,
  ) {
    console.log('Files received:', files);
    if (!dto.deviceDto) {
      throw new BadRequestException('Device data is missing.');
    }
    for (const deviceDto of dto.deviceDto) {
      const existingDevice = await this.locationService.findBySerialNumber(
        deviceDto.serialNumber,
      );
      if (existingDevice) {
        throw new BadRequestException(
          `A device with serial number '${deviceDto.serialNumber}' already exists.`,
        );
      }
    }
    return this.locationService.create(dto, files, userId);
  }

  @Get()
  @UseGuards(RtGuard)
  findAll(@GetCurrentUserId() userId: number) {
    return this.locationService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(RtGuard)
  findOne(@Param('id') id: number, @GetCurrentUserId() userId: number) {
    return this.locationService.findOne(+id, userId);
  }

  @Patch(':id')
  @UseGuards(RtGuard)
  update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.locationService.update(+id, updateLocationDto, userId);
  }

  @Delete(':id')
  @UseGuards(RtGuard)
  remove(@Param('id') id: number, @GetCurrentUserId() userId: number) {
    return this.locationService.remove(+id, userId);
  }
}
