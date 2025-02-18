import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '../.env') });

import { createServer } from 'http';

import app from './app/index.app.js';
import { getConnection } from './app/client/pg.config.client.js';

const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

import './app/service/deleteUploadFile.js';

(async () => {
  try {
    await getConnection();
    console.log('🔍 PG databse connected');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server launched at http://localhost:${PORT} 🚀`);
    });
  } catch (error) {
    console.log('Error connecting to the database', error);
    process.exit(1);
  }
})();
