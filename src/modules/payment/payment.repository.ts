import { Delete } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './payment.entity';
import { CreatePaymentDto } from './dtos/payment-create.dto';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<PaymentDocument>,
  ) {}

  async create(data: CreatePaymentDto): Promise<PaymentDocument> {
    const newPayment = new this.paymentModel(data);
    return newPayment.save();
  }

  async findById(id: string): Promise<PaymentDocument | null> {
    return this.paymentModel.findById({ _id: id }).populate('orderId').exec();
  }

  async findAll(): Promise<PaymentDocument[]> {
    return this.paymentModel.find().exec();
  }

  async findByOrderId(orderId: string): Promise<PaymentDocument[]> {
    return this.paymentModel.find({ orderId }).populate('orderId').exec();
  }

  async findByRepairRequestId(
    repairRequestId: string,
  ): Promise<PaymentDocument[]> {
    return this.paymentModel
      .find({ repairRequestId })
      .populate('orderId')
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.paymentModel.findByIdAndDelete(id).exec();
  }
}
