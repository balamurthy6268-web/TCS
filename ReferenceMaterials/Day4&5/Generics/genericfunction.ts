//To run this code
//npx ts-node genericfunction.ts
function identity<T>(value: T): T {
  return value;
}

identity<string>("hello"); // explicit
identity(42);            // inferred as number

function first<T>(arr: T[]): T | undefined {
  return arr[0];
  console.log(arr[0]); // T is still accessible here
}
console.log(first([1, 2, 3]));   // T = number
console.log(first(["a", "b"])); // T = string
