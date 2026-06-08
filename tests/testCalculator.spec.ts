
import {test,expect} from '@playwright/test';
import Calculator from './utils/Calculator';
import ScientificCalculator from './utils/ScientificCalculator';


let calculator: Calculator;

test.beforeAll(() => {
    console.log('Setting up resources before all tests');
    calculator = new Calculator("N");
    
});

test('Calculator add Test', async () => {
   
    // Test addition
    const sum = calculator.add(5, 3,2);
    console.log (sum);
    expect(sum).toBe(10);
    
});

test('Calculator Subtraction Test', async () => {
    // Test subtraction
    const difference = calculator.subtract(5, 3);
    expect(difference).toBe(2);
});

test('Scientific calculator add Test', async () => {
    // Test addition with scientific calculator
    const scientificCalculator = new ScientificCalculator("S");
    const sum = scientificCalculator.add(5, 3);
    expect(sum).toBe(8.5); // 8 from Calculator + 0.5 from ScientificCalculator
});

test('Calculator multiply test', async() => {

     const product = calculator.multiply(3,2);
     expect (product).toBe (6);
     

});