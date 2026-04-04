import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { appCreate } from 'app.create';
import { AppModule } from 'src/app.module';
import { MailService } from 'src/mail/providers/mail.service';
import { UploadToAwsProvider } from 'src/uploads/providers/upload-to-aws.provider';

export async function bootstrapNestApplication(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, ConfigModule],
    providers: [ConfigService],
  }) // MOCK THE MAIL SERVICE
    .overrideProvider(MailService)
    .useValue({
      sendUserWelcome: jest.fn().mockResolvedValue(true), // Use your actual method name
    })
    .overrideProvider(UploadToAwsProvider)
    .useValue({
      fileUpload: jest.fn().mockResolvedValue('http://mock-url.com'),
    })
    .compile();

  const app = moduleFixture.createNestApplication();
  appCreate(app);
  await app.init();
  return app;
}
