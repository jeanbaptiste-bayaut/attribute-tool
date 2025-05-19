import dotenv from 'dotenv';
import path from 'path';
import deleteUploadFiles from './app/utils/deleteUploadFiles.js';

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '../.env') });

import { createServer } from 'http';

import app from './app/index.app.js';
import { getConnection } from './app/client/pg.config.client.js';

const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

import './app/service/deleteUploadFile.js';

setInterval(() => {
  console.log('Deleting old files...');
  deleteUploadFiles();
}, 24 * 60 * 60 * 1000); // every 24 hours

(async () => {
  try {
    await getConnection();
    console.log('🔍 MYSQL databse connected');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server launched at http://localhost:${PORT} 🚀`);
    });
  } catch (error) {
    console.log('Error connecting to the database', error);
    process.exit(1);
  }
})();
