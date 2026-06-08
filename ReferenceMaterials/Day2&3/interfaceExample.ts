export interface ICalculator {
  calculate(a: number, b: number): number;
}

  class Multiplier implements ICalculator {
    calculate(a: number, b: number): number {
      return a * b;
    }   
}