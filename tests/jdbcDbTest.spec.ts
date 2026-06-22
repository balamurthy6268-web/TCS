import { test, expect } from '@playwright/test';
// install mysql2 package to connect to MySQL database
// command - npm install mysql2
import mysql from 'mysql2/promise';


test('@db Verify India exists in country table', async () => {
  // -----------------------------
  // DB Connection
  // -----------------------------
  const connection = await mysql.createConnection({
    host: 'localhost',
    port:  3306,
    user: 'root',
    password: 'root',
    database: 'sakila'
  });

  // -----------------------------
  // Execute Query
  // -----------------------------

    const searchTerm = 'In';
  
const query: string = 'SELECT country_id, country FROM sakila.country WHERE country LIKE ?';

const [rows]: any = await connection.execute(query, [`%${searchTerm}%`]);//console.log(rows);

  for (const row of rows) {
    console.log(row.country_id);
    console.log(row.country);
  }

test.afterAll()
{
  // -----------------------------
  // Close Connection
  // -----------------------------
  await connection.end();
}
  // -----------------------------
  // Assertion
  // -----------------------------
  expect(rows.length).toBeGreaterThan(0);
});
