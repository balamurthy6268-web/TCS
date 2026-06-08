import { add, log, MathResult } from "./barrelfile";

console.log(add(10, 20)); // 30
const result: MathResult = { value: add(5, 7), error: null };
console.log(result); // { value: 12, error: null }
log("This is a log message from the barrel file.");

