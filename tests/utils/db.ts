import mysql from 'mysql2/promise';

export async function executeQuery(query: string) {

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sakila',
    port: 3306
  });

  const [rows] = await connection.execute(query);

  await connection.end();

  return rows;
}