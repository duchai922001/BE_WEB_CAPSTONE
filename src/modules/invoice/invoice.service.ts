import { Injectable } from '@nestjs/common';
import { generateInvoiceHTML } from './invoice-template';
import { generateInvoiceRepairHTML } from './invoice-repair-template';

@Injectable()
export class InvoiceService {
  private async launchBrowser() {
    if (process.env.NODE_ENV === 'production') {
      // production: puppeteer-core + chrome-aws-lambda
      const puppeteer = await import('puppeteer-core');
      const { default: chromium } = await import('chrome-aws-lambda');

      return puppeteer.launch({
        executablePath:
          (await chromium.executablePath) || '/usr/bin/google-chrome',
        headless: true,
        args: chromium.args,
      });
    } else {
      // local dev: puppeteer
      const puppeteer = await import('puppeteer');
      return puppeteer.launch({ headless: true });
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
