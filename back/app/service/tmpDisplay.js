import fs from 'fs/promises';
import path from 'path';

export default class tmpDisplay {
  static async displayTmp(req, res) {
    const directory = path.join(import.meta.dirname, '..', '../public/uploads');
    const folderPath = `${directory}`;
    const listOfFile = [];
    try {
      const files = await fs.readdir(folderPath);

      const fileStatsPromises = files.map(async (file) => {
        const filePath = path.join(folderPath, file);

        // Vérifier si c'est un fichier (et pas un dossier par exemple)
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          // Ajouter le fichier à la liste si c'est un fichier
          const dateFormatted = new Date(stats.mtime).toLocaleString();
          listOfFile.push({
            name: file,
            size: stats.size,
            lastModified: dateFormatted,
          });
        }
      });

      // Attendre que toutes les vérifications soient terminées
      await Promise.all(fileStatsPromises);

      // Retourner la liste des fichiers sous forme de JSON
      res.render('tmp', { listOfFile: listOfFile });
    } catch (error) {
      console.error(error);
      res.status(500).send('Interal Server Error');
    }
  }
}
