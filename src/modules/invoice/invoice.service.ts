import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { generateInvoiceHTML } from './invoice-template';

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
}
