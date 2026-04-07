import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'postgres',
  host: 'ec2-host',
  port: 5432,
  username: 'klement',
  password: 'attlee',
  database: 'database',
  // Use join to ensure the path is absolute and valid
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
});
