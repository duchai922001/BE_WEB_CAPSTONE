import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RepairWarrantyPolicyRepository } from './repair-warranty-policy.repository';
import { RepairWarrantyPolicyService } from './repair-warranty-policy.service';
import { RepairWarrantyPolicyController } from './repair-warranty-policy.controller';
import {
  RepairWarrantyPolicy,
  RepairWarrantyPolicySchema,
} from './repair-warranty-policy.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RepairWarrantyPolicy.name, schema: RepairWarrantyPolicySchema },
    ]),
  ],
  controllers: [RepairWarrantyPolicyController],
  providers: [RepairWarrantyPolicyRepository, RepairWarrantyPolicyService],
  exports: [RepairWarrantyPolicyRepository],
})
export class RepairWarrantyPolicyModule {}
