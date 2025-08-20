import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { OrderService } from '../order/order.service';
import { OrderItemRepository } from '../orderItem/orderItem.repository';
import { PromotionRepository } from '../promotion/promotion.repository';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly orderService: OrderService,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly promotionRepo: PromotionRepository,
  ) {}

  @Get(':orderId')
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
}
