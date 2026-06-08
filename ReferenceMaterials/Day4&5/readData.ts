//create a file called readData.ts and write a function that reads data from a file and returns it as a string. Use the fs module to read the file.
//ts-node readData.ts

import fs from 'fs';

export function readData(filePath: string): string {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data;
    } catch (error) {
        console.error(`Error reading file: ${error}`);
        return '';
    }
}

readData('data.txt'); // Example usage, replace 'data.txt' with your actual file path.
const data = readData('./data.txt');
console.log(data);
