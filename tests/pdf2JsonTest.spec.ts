import fs from 'fs';
import { test, expect } from '@playwright/test';
import PDFParser from 'pdf2json';

test.describe('assert PDF contents using Playwright', () => {
  let pdfContents: any
  test.beforeAll(async () => {
    pdfContents = await getPDFContents('./pdf_sample.pdf')
  })

  test('pdf file should have 1 page', async () => {
    expect(pdfContents.Pages.length, 'PDF page count was incorrect').toEqual(1);
});

  test('shows the correct meta informaion (keywords)', async () => {
    expect(pdfContents.Meta.Keywords, 'PDF keyword was incorrect').toEqual('PDF ,JSON, PLAYWRIGHT');
    expect(pdfContents.Meta.Author, 'PDF Author was incorrect').toEqual('Bala Murthy');
});

  test('contains the correct subheading text', async () => {
    console.log(pdfContents);
    console.log(pdfContents.Pages[0].Texts[2].R[0].T);
    const rawText = pdfContents.Pages[0].Texts[2].R[0].T;
    expect(decodeURI(rawText), 'The subheading text was incorrect').toEqual('It has one page');
    
});
});

async function getPDFContents(pdfFilePath: string): Promise<any> {
  let pdfParser = new PDFParser();
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', (errData: Error | { parserError: Error }) =>
      reject('parserError' in errData ? errData.parserError : errData)
    );
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      resolve(pdfData);
    });

    pdfParser.loadPDF(pdfFilePath);
  });
}