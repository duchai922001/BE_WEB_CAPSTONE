import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './payment.repository';
import { CreatePaymentDto } from './dtos/payment-create.dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(data: CreatePaymentDto): Promise<Payment> {
    const { orderId, repairRequestId, amount, method, transactionCode } = data;
    const payment = await this.paymentRepository.create({
      orderId,
      repairRequestId,
      amount,
      method,
      transactionCode,
    });
    return payment;
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      return null;
    }
    return payment;
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async getPaymentsByOrderId(orderId: string): Promise<Payment[]> {
    return this.paymentRepository.findByOrderId(orderId);
  }

  async getPaymentsByRepairRequestId(
    repairRequestId: string,
  ): Promise<Payment[]> {
    return this.paymentRepository.findByRepairRequestId(repairRequestId);
  }

  async delete(id: string): Promise<void> {
    return await this.paymentRepository.deleteById(id);
  }
}
