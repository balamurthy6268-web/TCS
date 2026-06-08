import * as XLSX from 'xlsx';

export function readExcel(
  filePath: string,
  sheetName: string
)
 {

  const workbook = XLSX.readFile(filePath);

  const worksheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json(worksheet);
}