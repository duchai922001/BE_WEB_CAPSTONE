import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { OrderService } from '../order/order.service';
import { OrderItemRepository } from '../orderItem/orderItem.repository';
import { PromotionRepository } from '../promotion/promotion.repository';
import { RepairRequestRepository } from '../repairRequest/repairRequest.repository';
import { RepairInvoiceItemRepository } from '../repair-invoice-item/repair-invoice-item.repository';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly orderService: OrderService,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly promotionRepo: PromotionRepository,
    private readonly repaireRequestRepo: RepairRequestRepository,
    private readonly repairInoivceItemRepo: RepairInvoiceItemRepository,
  ) {}

  @Get('order/:orderId')
  async getInvoice(@Param('orderId') orderId: string, @Res() res: Response) {
    const order = await this.orderService.findById(orderId);

    order.orderItems = await this.orderItemRepo.getByOrderId(orderId);

    // lấy promotions
    const productIds = order.orderItems.map(
      (i) => i.product?._id?.toString() || '',
    );
    const { promos, defaultPromo } =
      await this.promotionRepo.findValidByProductIds(productIds);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="invoice-${orderId}.pdf"`,
    );

    const pdfBuffer = await this.invoiceService.generatePdf(
      order,
      'Nguyễn Văn A',
      promos,
      defaultPromo,
    );
    res.send(pdfBuffer);
  }

  @Get('repair/:repairRequestId')
  async getInvoiceRepair(
    @Param('repairRequestId') repairRequestId: string,
    @Res() res: Response,
  ) {
    const repairRequest =
      await this.repaireRequestRepo.findById(repairRequestId);
    if (!repairRequest) {
      return res.status(404).send('Repair request not found');
    }

    const repairInvoiceItems =
      await this.repairInoivceItemRepo.findByRepairRequestId(repairRequestId);

    const pdfBuffer = await this.invoiceService.generateRepairInvoice(
      repairRequest,
      repairInvoiceItems,
      'Nguyễn Văn A', // tên thu ngân
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="repair-invoice-${repairRequestId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  }
}
