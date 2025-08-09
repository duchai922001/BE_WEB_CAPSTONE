import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import * as qs from 'qs';
import * as moment from 'moment';

@Injectable()
export class ZaloPayService {
  private readonly app_id = '2553'; // ⚠️ Đổi theo app_id bạn lấy từ ZaloPay Dev
  private readonly key1 = 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL'; // ⚠️ key1 sandbox
  private readonly key2 = 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz'; // ⚠️ key2 sandbox
  private readonly endpoint = 'https://sb-openapi.zalopay.vn/v2/create';

  async createOrder(amount: number) {
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format('YYMMDD')}_${transID}`;
    const app_time = Date.now();
    const app_user = 'user123';

    const embed_data = {};
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
      bank_code: 'zalopayapp', // hoặc bỏ trống nếu không chỉ định
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
}
