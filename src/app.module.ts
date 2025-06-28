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
import { ProductModule } from './modules/product/product.module';
import { ProductImageModule } from './modules/productImage/productImage.module';
import { HashTagModule } from './modules/hashtags/hashtag.module';
import { StaffActionLogModule } from './modules/staffActionLog/staffActionLog.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { CartModule } from './modules/cart/cart.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/orderItem/orderItem.module';
import { CartItemModule } from './modules/cartItem/cartItem.module';
import { PromotionImageModule } from './modules/promotionImage/promotionImage.module';
import { AddressModule } from './modules/address/address.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OtpModule } from './modules/otp/otp.module';
import { Payment } from './modules/payment/payment.entity';
import { PaymentModule } from './modules/payment/payment.module';
import { FavoriteModule } from './modules/favorites/favorites.module';
import { AttributeKeyModule } from './modules/attribute-key/attribute-key.module';
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
    PromotionImageModule,
    AddressModule,
    BrandModule,
    CategoryModule,
    VariableModule,
    ProductModule,
    ProductImageModule,
    HashTagModule,
    StaffActionLogModule,
    PermissionModule,
    CartModule,
    EmployeeModule,
    OrderModule,
    OrderItemModule,
    CartItemModule,
    NotificationModule,
    OtpModule,
    PaymentModule,
    FavoriteModule,
    AttributeKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
