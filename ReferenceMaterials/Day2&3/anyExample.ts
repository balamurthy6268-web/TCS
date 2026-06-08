// Example demonstrating the 'any' type in TypeScript
// Without 'any'
let u = 10.5;
u = "somestring"; // Error: Type 'string' is not assignable to type 'number'.
Math.round(u); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(u);

// With 'any'
let v: any = "BBBB";
v = "string"; // OK
Math.round(v); // OK    
console.log(v);