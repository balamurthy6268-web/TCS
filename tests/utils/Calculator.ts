class Calculator {

     constructor(option : string) {
        

        console.log("Constructor is invoked with type as " + option);
    }

    //Correct TypeScript Method Overloading

//You define multiple signatures and only one implementation.
    add(a: number, b: number): number;
    add(a: number, b: number, c: number): number;

  // Then you provide a single implementation that handles all cases.
    add(a: number, b: number, c?: number): number {

        if (c !== undefined) {
            return a + b + c;
        }
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }
}
export default Calculator;