import mysql from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '../.env') });
const caPath = path.join(__dirname, '../certs/ca.pem');

if (!fs.existsSync(caPath)) {
  console.error(`❌ Certificat introuvable : ${caPath}`);
  process.exit(1);
}

// const client = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   ssl: {
//     ca: fs.readFileSync(caPath),
//   },
// });

const client = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  database: 'attributetool',
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
