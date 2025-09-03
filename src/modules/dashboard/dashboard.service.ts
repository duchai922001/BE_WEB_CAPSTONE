import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { getRange } from './date-range.util';
import { Order, OrderDocument } from '../order/order.entity';
import {
  RepairRequest,
  RepairRequestDocument,
} from '../repairRequest/repairRequest.entity';
import { GetDashboardDto } from './get-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(RepairRequest.name)
    private readonly repairModel: Model<RepairRequestDocument>,
  ) {}

  async getSummary(query: GetDashboardDto) {
    const {
      preset = 'today',
      tz = 'Asia/Ho_Chi_Minh',
      start,
      end,
      ordersDateField = 'createdAt',
      repairsDateField = 'createdAt',
    } = query;

    const [from, to] = getRange(preset, tz, start, end);

    const ordersMatch = { [ordersDateField]: { $gte: from, $lte: to } };
    const repairsMatch = { [repairsDateField]: { $gte: from, $lte: to } };

    const ordersAgg = this.orderModel.aggregate([
      { $match: ordersMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ['$totalAmount', 0] } },
          totalProfit: { $sum: { $ifNull: ['$estimatedRevenue', 0] } },
          totalDebt: { $sum: { $ifNull: ['$customerDept', 0] } },
          count: { $sum: 1 },
          customerPaid: { $sum: { $ifNull: ['$customerPaid', 0] } },
          lastAmount: { $sum: { $ifNull: ['$lastAmount', 0] } },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const repairsAgg = this.repairModel.aggregate([
      { $match: repairsMatch },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ['$actualCost', 0] } },
          totalProfit: {
            $sum: {
              $subtract: [
                { $ifNull: ['$actualCost', 0] },
                { $ifNull: ['$estimatedCost', 0] },
              ],
            },
          },
          totalDebt: { $sum: { $ifNull: ['$customerDept', 0] } },
          count: { $sum: 1 },
          customerPaid: { $sum: { $ifNull: ['$customerPaid', 0] } },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const [o = {}, r = {}] = (await Promise.all([ordersAgg, repairsAgg]).then(
      ([oArr, rArr]) => [oArr?.[0] ?? {}, rArr?.[0] ?? {}],
    )) as any;

    const safe = (v: any) => (typeof v === 'number' ? v : 0);

    const summary = {
      range: { from, to, tz, ordersDateField, repairsDateField },

      totalRevenue: safe(o.totalRevenue) + safe(r.totalRevenue),
      totalProfit: safe(o.totalProfit) + safe(r.totalProfit),
      totalDebt: safe(o.totalDebt) + safe(r.totalDebt),

      totalCount: safe(o.count) + safe(r.count),
      ordersCount: safe(o.count),
      repairsCount: safe(r.count),

      breakdown: {
        orders: {
          revenue: safe(o.totalRevenue),
          profit: safe(o.totalProfit),
          debt: safe(o.totalDebt),
          customerPaid: safe(o.customerPaid),
          lastAmount: safe(o.lastAmount),
          count: safe(o.count),
        },
        repairs: {
          revenue: safe(r.totalRevenue),
          profit: safe(r.totalProfit),
          debt: safe(r.totalDebt),
          customerPaid: safe(r.customerPaid),
          count: safe(r.count),
        },
      },
    };

    return summary;
  }
}
