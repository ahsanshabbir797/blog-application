import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProviderTs {
  constructor(
    /**
     * Injecting datasource for transaction
     */
    private dataSource: DataSource,
  ) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    //create Query Runner instance
    const queryRunner = this.dataSource.createQueryRunner();

    //connect Query Runner to data source
    try {
      await queryRunner.connect();
    } catch (error) {
      throw new RequestTimeoutException('Failed to connect to the database', {
        cause: error,
      });
    }

    try {
      //Start Transaction
      await queryRunner.startTransaction();
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      //If successful commit
      await queryRunner.commitTransaction();
    } catch (error) {
      //If unsuccessful rollback
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Failed to complete the transaction');
    } finally {
      try {
        //Release connection
        await queryRunner.release();
      } catch (error) {
        // Log this to your internal logger (Sentry, Winston, etc.)
        console.error('Critical: Failed to release QueryRunner:', error);
      }
    }
    return newUsers;
  }
}
