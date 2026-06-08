// define our readonly tuple
const ourReadonlyTuple: readonly [number, boolean, string] = [5, true, 'The Real Coding God'];
// attempt to change the first element
//ourReadonlyTuple[0] = 10; // Error: Cannot assign to '0' because it is a read-only property.
console.log(ourReadonlyTuple);

// define a regular tuple       
let ourTuple: [number, boolean, string] = [5, true, 'The Real Coding God'];
// change the first element
ourTuple[0] = 10; // No error
console.log(ourTuple);