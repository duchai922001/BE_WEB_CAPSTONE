import { Injectable } from '@nestjs/common';
import { generateInvoiceHTML } from './invoice-template';
import { generateInvoiceRepairHTML } from './invoice-repair-template';

// import trực tiếp để TS hiểu type cơ bản
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

@Injectable()
export class InvoiceService {
  private async launchBrowser() {
    if (process.env.NODE_ENV === 'production') {
      // production: puppeteer-core + @sparticuz/chromium
      return puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true, // chromium.headless cũng OK nhưng TS không có type → dùng true
      });
    } else {
      // local dev: full puppeteer
      const puppeteerDev = await import('puppeteer');
      return puppeteerDev.launch({ headless: true });
    }
  }

  async generatePdf(
    order: any,
    cashierName: string = 'Thu ngân',
    promoMap: Record<string, any> = {},
    defaultPromo: any = null,
  ): Promise<Buffer> {
    const browser = await this.launchBrowser();
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
    const browser = await this.launchBrowser();
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
