import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadImage(file);
    return {
      message: 'Upload thành công!',
      url: result.secure_url,
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // cho phép tối đa 10 ảnh
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const results = await this.uploadService.uploadMultipleImages(files);
    return {
      message: 'Tải lên thành công!',
      urls: results.map((r) => r.secure_url),
    };
  }
}
