// To run this TypeScript code, you can use the following commands in your terminal:
// 1. Install ts-node globally if you haven't already:
//    npm install -g ts-node
// 2. Run the TypeScript file directly:
//    ts-node app.ts
//npm install -g ts-node
//ts-node app.ts

//or
//npx tsc app.ts
//node app.js

import { PI, add, MathResult } from "./math";

const result: MathResult = { value: add(2, 3), error: null };
console.log(PI, result.value); // 3.14159  5