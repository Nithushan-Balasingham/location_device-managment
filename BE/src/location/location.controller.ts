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
  UploadedFiles,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { RtGuard } from '../auth/common/guards/rt.guard';
import { GetCurrentUserId } from '../auth/decorators/get-current-user-id.decorator';
import { AtGuard } from 'src/auth/common/guards';
import { Observable, of } from 'rxjs';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseGuards(RtGuard)
  @UseInterceptors(FilesInterceptor('file')) 
  create(
    @Body() dto: CreateLocationDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @GetCurrentUserId() userId: number,
  ) {
    console.log('Files received:', files); 

    return this.locationService.create(dto, files, userId);
  }

  @Get()
  @UseGuards(RtGuard)
  findAll() {
    return this.locationService.findAll();
  }

  @Get(':id')
  @UseGuards(RtGuard)
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RtGuard)
  update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(RtGuard)
  remove(@Param('id') id: number) {
    return this.locationService.remove(+id);
  }
}
