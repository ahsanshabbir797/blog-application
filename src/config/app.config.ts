import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  development: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsCloudfrontUrl: process.env.AWS_CLOUDFRONT_URL,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}));

// export const appConfig = () => ({
//   development: process.env.NODE_ENV || 'production',
//   database: {
//     host: process.env.DATABASE_HOST || 'localhost',
//     port: parseInt(process.env.DATABASE_PORT ?? '5432', 10) || 5432,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     name: process.env.DATABASE_NAME,
//     synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
//     autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
//   },
// });
