import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductWarrantyPolicyController } from './product-warranty-policy.controller';
import { ProductWarrantyPolicyService } from './product-warranty-policy.service';
import { ProductWarrantyPolicyRepository } from './product-warranty-policy.repository';
import {
  ProductWarrantyPolicy,
  ProductWarrantyPolicySchema,
} from './product-warranty-policy.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductWarrantyPolicy.name, schema: ProductWarrantyPolicySchema },
    ]),
  ],
  controllers: [ProductWarrantyPolicyController],
  providers: [ProductWarrantyPolicyRepository, ProductWarrantyPolicyService],
  exports: [ProductWarrantyPolicyRepository],
})
export class ProductWarrantyPolicyModule {}
