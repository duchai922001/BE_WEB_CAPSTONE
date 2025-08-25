import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import * as qs from 'qs';
import * as moment from 'moment';
import { OrderRepository } from 'src/modules/order/order.repository';

@Injectable()
export class ZaloPayService {
  constructor(private readonly orderRepository: OrderRepository) {}
  private readonly app_id = '2553';
  private readonly key1 = 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL';
  private readonly key2 = 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz';
  private readonly endpoint = 'https://sb-openapi.zalopay.vn/v2/create';

  async createOrder(amount: number, orderId: string) {
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const app_time = Date.now();
    const app_user = 'user123';

    const embed_data = {
      redirecturl: `https://www.bluetoothmobile.vn/payment-result?orderId=${orderId}paymentType=ZALOPAY`,
      // redirecturl: `http://localhost:5173/payment-result?orderId=${orderId}`,
      orderId: orderId,
    };
    const items = [{}];

    const order = {
      app_id: this.app_id,
      app_trans_id,
      app_user,
      app_time,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      description: `Thanh toán đơn hàng #${transID}`,
      bank_code: 'zalopayapp',
      callback_url:
        'https://be-web-bluetooth-v1.onrender.com/checkout/zalo/callback',
      // callback_url: 'http://localhost:5173/payment-customer-paid/callback',
    };

    const data = [
      order.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
    ].join('|');

    const mac = crypto
      .createHmac('sha256', this.key1)
      .update(data)
      .digest('hex');
    const payload = {
      ...order,
      mac,
    };

    try {
      const response = await axios.post(this.endpoint, qs.stringify(payload), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (err) {
      console.error(
        '❌ ZaloPay create order failed:',
        err?.response?.data || err.message,
      );
      throw new Error('ZaloPay create order failed');
    }
  }

  async createOrderCustomer(amount: number, orderId: string) {
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const app_time = Date.now();
    const app_user = 'user123';

    const embed_data = {
      redirecturl: `https://www.bluetoothmobile.vn/payment-customer-paid?orderId=${orderId}&paymentType=ZALOPAY`,
      // redirecturl: `http://localhost:5173/payment-customer-paid?orderId=${orderId}`,
      orderId: orderId,
    };
    const items = [{}];

    const order = {
      app_id: this.app_id,
      app_trans_id,
      app_user,
      app_time,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      description: `Thanh toán đơn hàng #${transID}`,
      bank_code: 'zalopayapp',
      callback_url:
        'https://be-web-bluetooth-v1.onrender.com/checkout/zalo/callback',
      // callback_url: 'http://localhost:5173/payment-customer-paid/callback',
    };

    const data = [
      order.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
    ].join('|');

    const mac = crypto
      .createHmac('sha256', this.key1)
      .update(data)
      .digest('hex');
    const payload = {
      ...order,
      mac,
    };

    try {
      const response = await axios.post(this.endpoint, qs.stringify(payload), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (err) {
      console.error(
        '❌ ZaloPay create order failed:',
        err?.response?.data || err.message,
      );
      throw new Error('ZaloPay create order failed');
    }
  }

  async handleCallback(payload: any) {
    const {
      appid,
      apptransid,
      pmcid,
      amount,
      discountamount,
      status,
      checksum,
      embed_data,
    } = payload;
    console.log({ payload });
    let embedDataObj = {};
    try {
      embedDataObj = embed_data ? JSON.parse(embed_data) : {};
    } catch (e) {
      console.warn('Embed data parse error', e);
    }

    // await this.orderRepository.update(orderId, { customerPaid: amount });
  }
}
