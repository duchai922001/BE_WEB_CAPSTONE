import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as crypto from 'crypto';
import * as qs from 'qs';

@Injectable()
export class VnpayService {
  private tmnCode = 'KN8NCO49';
  private secretKey = 'DFQHS348HO0VZQ0WNEY6RSVQNBU1HF1C';
  private vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private returnUrl = 'http://localhost:8080/order/vnpay_return';

  createPaymentUrl(orderId: string, amount: number): string {
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const ipAddr = '127.0.0.1'; // Hoặc lấy từ req.ip

    const vnp_Params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan don hang: ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: (amount * 100).toString(), // ❗️PHẢI là string
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_BankCode: 'NCB',
    };

    // ✅ Sắp xếp key theo thứ tự alphabet
    const sortedParams = this.sortObject(vnp_Params);

    // ❗️Không được encode khi ký
    const signData = qs.stringify(sortedParams, { encode: false });

    const hmac = crypto.createHmac('sha512', this.secretKey);
    const secureHash = hmac
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    // ✅ Clone lại object để không làm hỏng sortedParams
    const signedParams = {
      ...sortedParams,
      vnp_SecureHash: secureHash,
    };

    // ✅ Tạo URL cuối
    const paymentUrl = `${this.vnpUrl}?${qs.stringify(signedParams, { encode: false })}`;

    return paymentUrl;
  }

  private sortObject(obj: Record<string, any>) {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sorted[key] = obj[key];
    }
    return sorted;
  }
}
