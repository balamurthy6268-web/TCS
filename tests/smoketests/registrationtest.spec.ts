import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';

test('faker data for Registration process', async () => {

console.log(faker.person.firstName());
console.log(faker.person.lastName());
console.log(faker.internet.email());
console.log(faker.internet.password());
console.log(faker.date.month());
console.log(faker.phone.number());

//extract the last row, extract the number from the id column , 
// then add 1 to it and use it for insert into customers values(newid,fn,ln,ph,em)



});
