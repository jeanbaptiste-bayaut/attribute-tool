import multer from 'multer';
import path from 'path';
import fs from 'fs';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  const hours = today.getHours();
  const minutes = today.getMinutes();
  return `${month}-${date}-${year}-${hours}-${minutes}`;
}

// Créez le répertoire de stockage des fichiers si nécessaire
const uploadDir = 'public/uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + getDate() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only CSV is allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 40 }, // 5MB
});

// Middleware d'erreur Multer personnalisé
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Gérer les erreurs liées à Multer (comme la limite de taille de fichier)
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Gérer les autres erreurs (par exemple, le type de fichier invalide)
    return res.status(400).json({ message: err.message });
  }
  console.log('Multer error handled');

  next();
};

export { upload, handleMulterError };
