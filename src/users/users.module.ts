import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import profileConfig from './config/profile.config';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProviderTs } from './providers/users-create-many.provider.ts';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindonebyemailProvider } from './providers/findonebyemail.provider';

@Module({
  controllers: [UsersController],
  providers: [UserService, UsersCreateManyProviderTs, CreateUserProvider, FindonebyemailProvider],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
  ],
})
export class UsersModule {}
