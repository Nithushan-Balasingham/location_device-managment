import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    if (!file) {
      throw new Error('File not found');
    }
    console.log('File uploaded', file);
    return { message: 'File uploaded successfully' };
  }
}
