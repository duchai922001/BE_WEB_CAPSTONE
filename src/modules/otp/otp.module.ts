import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './otp.entity';
import { OtpRepository } from './otp.repository';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
  UserModule,
],
  providers: [OtpRepository, OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule {}