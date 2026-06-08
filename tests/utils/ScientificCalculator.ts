import  Calculator  from './Calculator';

class ScientificCalculator extends Calculator {

    override add(a: number, b: number): number {

        console.log('Scientific Calculator add');

        const result = super.add(a, b);

        return result + 0.5; // scientific adjustment
    }
}
export default ScientificCalculator;