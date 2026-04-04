import { DataSource } from 'typeorm';

export async function resetDatabase(dataSource: DataSource) {
  await dataSource.synchronize(true);
}
