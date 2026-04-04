import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from 'app.create';
// import { config } from 'aws-sdk';
// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //add middleware
  appCreate(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
