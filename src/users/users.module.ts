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
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    UsersCreateManyProviderTs,
    CreateUserProvider,
    FindonebyemailProvider,
  ],
  exports: [UserService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class UsersModule {}
