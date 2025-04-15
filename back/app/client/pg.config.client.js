import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '../.env') });

// import pg from 'pg';
// const { Pool } = pg;

// const PG_PORT = process.env.ENV === 'dev' ? 5433 : 5432;

// const client = new Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: PG_PORT,
// });

const client = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
});

async function getConnection() {
  try {
    await client.getConnection();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database', error);
    throw error;
  }
}

export { client, getConnection };
