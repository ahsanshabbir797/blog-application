import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'ec2-host',
  port: 5432,
  username: 'klement',
  password: 'attlee',
  database: 'suarez',
  entities: ['**/*.entity.ts'],
  migrations: ['migrations/*.ts'],
});
