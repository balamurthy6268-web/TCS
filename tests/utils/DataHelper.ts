import * as fs from 'fs';
import * as XLSX from 'xlsx';

export class DataHelper {

    /**
     * Create a single object
     */
    static createData<T>(data: T): T {
        return data;
    }

    /**
     * Create array of objects
     */
    static createDataList<T extends { username: string; password: string }>(data: T[]): T[] {
        return data;
    }

    /**
     * Read JSON file
     */
    static readJson<T>(filePath: string): T {

        const fileContent = fs.readFileSync(
            filePath,
            'utf-8'
        );

        return JSON.parse(fileContent) as T;
    }

    /**
     * Read Excel file
     */
    static readExcel<T>(
        filePath: string,
        sheetName: string
    ): T[] {

        const workbook =
            XLSX.readFile(filePath);

        const worksheet =
            workbook.Sheets[sheetName];

        return XLSX.utils.sheet_to_json<T>(
            worksheet
        );
    }
}