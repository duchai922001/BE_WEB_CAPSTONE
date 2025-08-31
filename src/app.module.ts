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
import { PaymentModule } from './modules/payment/payment.module';
import { FavoriteModule } from './modules/favorites/favorites.module';
import { AttributeKeyModule } from './modules/attribute-key/attribute-key.module';
import { RepairRequestModule } from './modules/repairRequest/repairRequest.module';
import { RepairServiceModule } from './modules/repairService/repairService.module';
import { RepairRequestServiceModule } from './modules/repairRequestService/repairRequestService.module';
import { RepairInvoiceItemModule } from './modules/repair-invoice-item/repair-invoice-item.module';
import { SpecificationsModule } from './modules/specifications/specifications.module';
import { InstalmentRequestModule } from './modules/instalmentRequest/instalmentCart.module';
import { SpecificationsKeyModule } from './modules/specifications-key/specifications-key.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { RepairWarrantyPolicyModule } from './modules/repair-warranty-policy/repair-warranty-policy.module';
import { ChatboxAIModule } from './modules/chatbox-ai/chatbox-ai.module';
import { AdviseModule } from './modules/advise/advise.module';
import { InstalmentBankModule } from './modules/instalmentBank/instalment-bank.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ProductWarrantyPolicyModule } from './modules/product-warranty-policy/product-warranty-policy.module';
import { WarrantyRequestModule } from './modules/warranty-request/warranty-request.module';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
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
    RepairRequestModule,
    RepairServiceModule,
    RepairRequestServiceModule,
    RepairInvoiceItemModule,
    SpecificationsModule,
    InstalmentRequestModule,
    SpecificationsKeyModule,
    CheckoutModule,
    RepairWarrantyPolicyModule,
    ChatboxAIModule,
    AdviseModule,
    InstalmentBankModule,
    InvoiceModule,
    ProductWarrantyPolicyModule,
    WarrantyRequestModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
