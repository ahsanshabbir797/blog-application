import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadEntity } from '../upload.entity';
import { Repository } from 'typeorm';
import { FileUpload } from '../interfaces/file-upload.interface';
import { FileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    /**
     * Inject uploadToAwsS3 provider
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    /**
     * Inject config service
     */
    private readonly configService: ConfigService,
    /**
     * Inject upload repository
     */
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    try {
      //check the mimetypes to only allow certain image mimetypes
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(
          file.mimetype,
        )
      ) {
        throw new BadRequestException('Mime type not supported');
      }
      //upload file to aws s3
      const name = await this.uploadToAwsProvider.fileUpload(file);
      //store the file details in the database
      const uploadFile: FileUpload = {
        name: name,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        size: file.size,
        mime: file.mimetype,
        type: FileTypes.IMAGE,
      };

      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
