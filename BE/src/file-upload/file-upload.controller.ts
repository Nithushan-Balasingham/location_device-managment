import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('files'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded File:', file); 
    return this.fileUploadService.handleFileUpload(file);
  }
}
