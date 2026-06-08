//importing the entire module as Math and using its properties and functions with the Math prefix.
//namespace is a way to organize code and avoid naming conflicts by grouping related code together under a common name. In this example, we have a namespace called Math that contains a constant PI and a function add. We can access these members using the Math prefix, as shown in the console.log statements. 


import * as Math from "./math";

console.log(Math.PI);        // 3.14159
console.log(Math.add(4, 5)); // 9