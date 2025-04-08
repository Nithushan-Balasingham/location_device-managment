import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import * as path from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: path.join(__dirname, '../../uploads/devices'),
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`; 
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [MulterModule], 
})
export class FileUploadModule {}