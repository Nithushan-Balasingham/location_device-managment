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
import { FileInterceptor } from '@nestjs/platform-express';
// export const storage = {
//   storage: diskStorage({
//     destination: './uploads/profileimages',
//     filename: (req, file, cb) => {
//       const filename: string =
//         path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
//       const extension: string = path.parse(file.originalname).ext;

//       cb(null, `${filename}${extension}`);
//     },
//   }),
// };
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @UseGuards(RtGuard)
  create(
    @GetCurrentUserId() userId: number,
    @UploadedFile() file,
    @Body() dto: CreateLocationDto,
  ) {
    return this.locationService.create(dto, userId);
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
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', storage))
  // uploadFile(@UploadedFile() file): Observable<any> {
  //   console.log('File', file);
  //   return of({ imagePath: file.path });
  // }
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
