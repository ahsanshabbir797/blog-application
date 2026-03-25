import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { type Express } from 'express';
import { UploadsService } from './providers/uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeaders, ApiOperation } from '@nestjs/swagger';

@Controller('uploads')
export class UploadsController {
  constructor(
    /**
     * Inject upload service
     */
    private readonly uploadsService: UploadsService,
  ) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a new image to the server',
  })
  @ApiHeaders([
    { name: 'Content-Type', description: 'multi-part/form-data type' },
    { name: 'Authorization', description: 'Bearer Token' },
  ])
  public fileUpload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.uploadFile(file);
  }
}
