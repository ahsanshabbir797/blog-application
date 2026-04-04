import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { bootstrapNestApplication } from 'test/helpers/bootstrap-nest-application.helper';
import { App } from 'supertest/types';
import {
  completeUser,
  emailMissing,
  firstNameMissing,
  passwordMissing,
} from './users.post.e2e-spec.sample-data';
import { resetDatabase } from 'test/helpers/reset-database.helper';
import { DataSource } from 'typeorm';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication;
  // let config: ConfigService;
  let httpServer: App;
  let dataSource: DataSource;

  beforeAll(async () => {
    app = await bootstrapNestApplication();
    // config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();

    dataSource = app.get(DataSource);
  });

  // You can keep dropDatabase in beforeEach if you want a clean DB for every test
  beforeEach(async () => {
    // await dropDatabase(config);
    await resetDatabase(dataSource);
  });

  // beforeEach(async () => {
  //   //instantiating the application
  //   app = await bootstrapNestApplication();
  //   // extracting the config
  //   config = app.get<ConfigService>(ConfigService);
  //   httpServer = app.getHttpServer();
  // });

  // afterEach(async () => {
  //   await dropDatabase(config);
  //   await app.close();
  // });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('/users - Endpoint is public', () => {
    return request(httpServer).post('/users').send({}).expect(400);
    // .then(({ body }) => console.log(body, completeUser));
  });
  it('/users - firstName is mandatory', () => {
    return request(httpServer)
      .post('/users')
      .send(firstNameMissing)
      .expect(400);
  });
  it('/users - email is mandatory', () => {
    return request(httpServer).post('/users').send(emailMissing).expect(400);
  });
  it('/users - password is mandatory', () => {
    return request(httpServer).post('/users').send(passwordMissing).expect(400);
  });
  it('/users - Valid request successfully creates user', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data).toBeDefined();
        expect(body.data.firstName).toBe(completeUser.firstName);
        expect(body.data.lastName).toBe(completeUser.lastName);
        expect(body.data.email).toBe(completeUser.email);
      });
    // .catch((err) => console.log(err));
  });
  it('/users - password is not returned in response', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.password).toBeUndefined();
      });
  });
  it('/users - googleId is not returned in response', () => {
    return request(httpServer)
      .post('/users')
      .send(completeUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.googleId).toBeUndefined();
      });
  });
});
