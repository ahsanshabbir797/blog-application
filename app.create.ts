import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function appCreate(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blog app API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense('MIT License', 'https://mit.com')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  //configure aws sdk for file uploads to s3 bucket
  // const configService = app.get(ConfigService);
  // config.update({
  //   credentials: {
  //     accessKeyId: configService.get('appConfig.awsAccessKeyId') || '',
  //     secretAccessKey: configService.get('appConfig.awsSecretAccessKey') || '',
  //   },
  //   region: configService.get('appConfig.awsRegion'),
  //   signatureVersion: 'v4',
  // });

  //enable CORS
  app.enableCors();
  //apply global interceptors
  // app.useGlobalInterceptors(new DataResponseInterceptor());
}
