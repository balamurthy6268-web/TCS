/*
npm install -g ts-node typescript
ts-node app.ts
*/
let isActive: boolean = true;
let hasPermission = false; // TypeScript infers 'boolean' type
// Output the values
console.log(isActive);
console.log(hasPermission);

// Number type examples
let decimal: number = 6;
let hex: number = 0xf00d;      // Hexadecimal
let binary: number = 0b1010;   // Binary
let octal: number = 0o744;     // Octal
let float: number = 3.14;      // Floating point

// Output the values
console.log(decimal);
console.log(hex);
console.log(binary);
console.log(octal);
console.log(float);

// String type examples
let color: string = "blue";
let fullName: string = 'John Doe';
let age: number = 30;
let sentence: string = `Hello, my name is ${fullName} and I'll be ${age + 1} next year.`;

// Output the values
console.log(color);
console.log(fullName);
console.log(age);
console.log(sentence);