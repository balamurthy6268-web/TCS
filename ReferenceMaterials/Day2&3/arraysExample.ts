const names: string[] = [];
names.push("Mani"); // no error
names.push("Ruma"); // no error

// names.push(3); // Error: Argument of type 'number' is not assignable to parameter of type 'string'.
console.log(names);

//Readonly array
//const names: readonly string[] = ["Dylan"];
const students:  string[] = ["Ramesh"];
students.push("Manish"); // Error: Property 'push' does not exist on type 'readonly string[]'.
// try removing the readonly modifier and see if it works?
console.log(students);