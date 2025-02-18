import fs from 'fs';
import path from 'path';
import cron from 'node-cron';

// Chemin du dossier à surveiller
const directory = path.join(import.meta.dirname, '..', '../public/uploads');
const folderPath = `${directory}`;

// Fonction pour supprimer les fichiers de plus d'une semaine'
function supprimerFichiersAnciens() {
  console.log('script de suppression lancé');

  const now = Date.now();

  // Lire le contenu du dossier
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Erreur lors de la lecture du dossier: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Vérifier si c'est un fichier (pas un dossier)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(
            `Erreur lors de l'obtention des infos du fichier: ${err.message}`
          );
          return;
        }

        // Calculer l'âge du fichier
        const fileAgeInMs = now - stats.mtimeMs;
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes

        // Si le fichier a plus d'une semaine, le supprimer
        if (fileAgeInMs > oneWeekInMs) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(
                `Erreur lors de la suppression du fichier: ${err.message}`
              );
            } else {
              console.log(`Fichier supprimé: ${filePath}`);
            }
          });
        }
      });
    });
  });
}

// Planifier la tâche avec node-cron pour l'exécuter tous les jours à 9h
cron.schedule(
  '* 9 * * *',
  () => {
    console.log(
      'Exécution de la tâche de suppression des fichiers anciens à 9h'
    );
    supprimerFichiersAnciens();
  },
  {
    timezone: 'Europe/Paris', // Option pour définir le fuseau horaire
  }
);
