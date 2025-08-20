import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { generateInvoiceHTML } from './invoice-template';
import { generateInvoiceRepairHTML } from './invoice-repair-template';

@Injectable()
export class InvoiceService {
  async generatePdf(
    order: any,
    cashierName: string = 'Thu ngân',
    promoMap: Record<string, any> = {},
    defaultPromo: any = null,
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const htmlContent = generateInvoiceHTML(
      order,
      cashierName,
      promoMap,
      defaultPromo,
    );
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfData = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return Buffer.from(pdfData);
  }
  async generateRepairInvoice(
    repairRequest: any,
    invoiceItems: any[],
    cashierName: string = 'Thu ngân',
  ): Promise<Buffer> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const htmlContent = generateInvoiceRepairHTML(
      repairRequest,
      invoiceItems,
      cashierName,
    );
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfData = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    });

    await browser.close();
    return Buffer.from(pdfData);
  }
}
