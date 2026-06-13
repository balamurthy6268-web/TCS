//create a file called writetextfile.ts and write a function that writes text to a file. Use the fs module to write to the file.
import fs from 'fs';

export function writeTextFile(filePath: string, text: string): void {
    try {
        fs.writeFileSync(filePath, text, 'utf-8');
        fs.appendFileSync(filePath, '\n', 'utf-8'); // Add a newline after the text
        fs.appendFileSync(filePath, 'This is an additional line on 8 jun.', 'utf-8'); // Add another line of text
        
        console.log(`Text written to file: ${filePath}`);
    } catch (error) {
        console.error(`Error writing to file: ${error}`);
    }
}

writeTextFile('output.txt', 'Hello, this is a test.'); // Example usage, replace 'output.txt' and the text with your desired values.    
