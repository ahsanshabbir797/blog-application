import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  constructor(
    /**
     * Inject config service
     */
    private readonly configService: ConfigService,
  ) {}

  public async fileUpload(file: Express.Multer.File) {
    //upload file to the s3 bucket & get the presigned url
    // const s3 = new S3();
    const accessKeyId = this.configService.get<string>(
      'appConfig.awsAccessKeyId',
    );
    const secretAccessKey = this.configService.get<string>(
      'appConfig.awsSecretAccessKey',
    );
    const region = this.configService.get<string>('appConfig.awsRegion');
    const s3 = new S3({
      accessKeyId,
      secretAccessKey,
      region,
      signatureVersion: 'v4',
    });
    console.log('s3:::', s3);

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('appConfig.awsBucketName')!,
          Body: file.buffer,
          Key: this.generateFileName(file),
          ContentType: file.mimetype,
        })
        .promise();
      //save the file upload details to the database

      return uploadResult.Key;
    } catch (error) {
      console.log('error:::', error);
      throw new RequestTimeoutException(error);
    }
  }

  private generateFileName(file: Express.Multer.File) {
    const extension = path.extname(file.originalname).toLowerCase();

    const baseName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // replace groups with dash
      .replace(/^-+|-+$/g, ''); // trim dashes

    return `${baseName}-${Date.now()}-${uuid4()}${extension}`;
  }
}
