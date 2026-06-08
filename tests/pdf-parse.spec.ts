import fs from 'fs';
import * as pdf from 'pdf-parse';
import { test, expect } from '@playwright/test';
import { parse } from 'path';

async function parsePdfFile(filePath: string): Promise<void> {
  try {
    // 1. Read the PDF file into a buffer
    const dataBuffer: Buffer = fs.readFileSync(filePath);

    // 2. Parse the PDF (using standard Promise-based API)
    // The data object follows the PdfParse.Result interface
    const data = await pdf.default(dataBuffer);


    // 3. Access extracted data
    console.log(`Total Pages: ${data.numpages}`); // Number of pages
    console.log(`Document Author: ${data.info.Author}`); // Metadata
    console.log('Text Content Preview:');
    console.log(data.text.slice(0, 500)); // First 500 characters

  } catch (error) {
    console.error('Error parsing PDF:', error);
  }
}
test('parse PDF file', async () => {
  const dataBuffer = fs.readFileSync('./pdf_sample.pdf');

  const data = await pdf.default(dataBuffer);
 
  console.log(data.text); 
  parsePdfFile('./pdf_sample.pdf');
  
});
