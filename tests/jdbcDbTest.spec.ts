import { test, expect } from '@playwright/test';
// install mysql2 package to connect to MySQL database
import mysql from 'mysql2/promise';


test('@db Verify India exists in country table', async () => {
  // -----------------------------
  // DB Connection
  // -----------------------------
  const connection = await mysql.createConnection({
    host: 'localhost',
    port:3306,
    user: 'root',
    password: 'root',
    database: 'sakila'
  });

  // -----------------------------
  // Execute Query
  // -----------------------------
  const [rows]: any = await connection.execute(
    "SELECT country FROM sakila.country where country = 'India'"
  );
  console.log(rows);

  // -----------------------------
  // Close Connection
  // -----------------------------
  await connection.end();

  // -----------------------------
  // Assertion
  // -----------------------------
  expect(rows.length).toBeGreaterThan(0);
});
