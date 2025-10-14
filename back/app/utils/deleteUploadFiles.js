import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const uploadDir = path.join(__dirname, 'public/uploads/');

const deleteUploadFiles = () => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
    }

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      console.log(`Checking file: ${filePath}`);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err);
          return;
        }

        // Check if the file is older than 7 day (24 hours)
        const oneWeek = 60 * 24 * 7 * 1000; // 7 days in milliseconds
        const now = new Date();
        const fileDate = new Date(stats.mtimeMs);
        if (now - fileDate > oneWeek) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log(`Deleted old file: ${file}`);
            }
          });
        }
      });
    });
  });
};

export default deleteUploadFiles;
