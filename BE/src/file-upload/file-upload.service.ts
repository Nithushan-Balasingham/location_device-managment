import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
  handleFileUpload(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    console.log('File Path:', file.path); 
    console.log('File MimeType:', file.mimetype); 

    // const maxSize = 5 * 1024 * 1024;
    // if (file.size > maxSize) {
    //   throw new BadRequestException('File is too large!');
    // }

    return { message: 'File uploaded successfully', filePath: file.path };
  }
}
