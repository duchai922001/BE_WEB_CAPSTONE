import { Injectable } from '@nestjs/common';
const PayOS = require('@payos/node');

@Injectable()
export class PayosService {
  private readonly payos: any;

  constructor() {
    this.payos = new PayOS(
      process.env.PAYOS_CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY,
    );
  }

  async createPaymentLink(amount: number, orderId: string) {
    const code = Math.floor(Math.random() * 9007199254740991) + 1;

    const shortCode = code.toString().slice(-6);
    const description = `Thanh toán #${shortCode}`;
    const returnUrl = `${process.env.PAYOS_RETURN_URL}?orderId=${orderId}&paymentType=PAYOS&amount=${amount}`;
    const cancelUrl = `${process.env.PAYOS_CANCEL_URL}?orderId=${orderId}&paymentType=PAYOS&amount=${amount}`;
    const link = await this.payos.createPaymentLink({
      orderCode: code,
      amount,
      description,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
    });

    return link;
  }

  verifyCallbackSignature(data: any): boolean {
    try {
      this.payos.verifyPaymentWebhookData(data);
      return true;
    } catch (err) {
      return false;
    }
  }
}
