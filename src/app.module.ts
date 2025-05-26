import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
import { BlogModule } from './modules/blogs/blog.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { BrandModule } from './modules/brands/brand.module';
import { CategoryModule } from './modules/categories/category.module';
import { VariableModule } from './modules/variables/variable.module';
import { HashTagModule } from './modules/hashtags/hashtag.module';
import { StaffActionLogModule } from './modules/staffActionLog/staffActionLog.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UserModule,
    BlogModule,
    AuthModule,
    UploadModule,
    FeedbackModule,
    PromotionModule,
    BrandModule,
    CategoryModule,
    VariableModule,
    HashTagModule,
    StaffActionLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
