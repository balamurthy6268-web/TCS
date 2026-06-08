import { executeQuery } from './utils/db';
import { test,expect } from '@playwright/test';

test('Verify user exists in DB', async () => {

  const result = await executeQuery(
    "SELECT * FROM sakila.customer where customer_id=11"
  );

  
  console.log(result);
  console.log(result.toString());
  expect (result).toBeTruthy();

});