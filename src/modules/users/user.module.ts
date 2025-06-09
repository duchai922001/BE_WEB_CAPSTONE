import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../roles/role.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../roles/guards/role.guard';
import { AuthModule } from '../auth/auth.module';
import { PermissionModule } from '../permissions/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RoleModule,
    PermissionModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserRepository,
    UserService,
  ],
  exports: [UserRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}
