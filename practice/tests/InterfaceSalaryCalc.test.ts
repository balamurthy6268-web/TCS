import { test,expect } from '@playwright/test';

interface SalaryCalculator {
    calculateSalary(baseSalary: number): number;
}

class DataTel implements SalaryCalculator {

    calculateSalary(baseSalary: number): number {
        return baseSalary + 10000;
    }
}

class Infomine implements SalaryCalculator {

    calculateSalary(baseSalary: number): number {
        return baseSalary + (baseSalary * 0.15);
    }
}

test('HR salary processing', async () => {

    const companies: SalaryCalculator[] = [
        new DataTel(),
        new Infomine()
    ];

    const baseSalary = 50000;

    for (const company of companies) {

        const finalSalary =
            company.calculateSalary(baseSalary);

        console.log(`Final Salary = ${finalSalary}`);
         expect(finalSalary).toBeGreaterThan(baseSalary);
    }
});