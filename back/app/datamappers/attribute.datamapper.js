import CoreDatamapper from './core.datamapper.js';
import csvParser from 'csv-parser';
import fs from 'fs';
import { pipeline } from 'stream';
import util from 'util';
const pipelineAsync = util.promisify(pipeline);

function cleanKeys(obj) {
  const cleanedObj = {};
  for (const key in obj) {
    const cleanedKey = key.trim().replace(/['"]+/g, '');
    // Supprime les apostrophes/guillemets et espaces
    cleanedObj[cleanedKey] = obj[key];
  }
  return cleanedObj;
}

export default class AttributeDataMapper extends CoreDatamapper {
  static tableName = 'attribute';

  static async uploadAttributes(filePath) {
    const results = [];
    try {
      await this.client.query('BEGIN'); // Commencer une transaction

      const readStream = fs
        .createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }));

      for await (const row of readStream) {
        const cleanedRow = cleanKeys(row);

        if (!Object.keys(cleanedRow)[0].split(',').includes('name')) {
          throw new Error('header must include "name"');
        }
        results.push(cleanedRow);
      }

      const insertQuery = `
      INSERT INTO attribute (name)
      VALUES (?);
    `;

      for (const row of results) {
        await this.client.query(insertQuery, [row.name]);
      }
      await this.client.query('COMMIT'); // Valider la transaction

      return { success: 'File uploaded and processed successfully' };
    } catch (error) {
      await this.client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
      throw new Error(error);
    }
  }

  static async uploadAttributesValues(filePath) {
    const BATCH_SIZE = 500;
    const attributeCache = new Map();
    const valuesToInsert = [];
    const noExistingAttributes = [];

    try {
      await this.client.query('BEGIN');

      // Lecture et parsing du fichier CSV
      await pipelineAsync(
        fs.createReadStream(filePath),
        csvParser({ separator: ';' }),
        async function* (source) {
          // Récupération des id des attributs
          for await (const row of source) {
            const cleanedRow = cleanKeys(row);
            const attributeName = cleanedRow.attribute;

            // Vérification de l'existence de l'attribut dans le cache
            let attributeId = attributeCache.get(attributeName);
            if (attributeId === undefined) {
              const [result] = await this.client.query(
                `
            SELECT id FROM attribute WHERE name = ?;`,
                [attributeName]
              );

              if (result.length === 0) {
                noExistingAttributes.push(attributeName);
                attributeCache.set(attributeName, null);
                continue;
              }

              attributeId = result[0].id;
              attributeCache.set(attributeName, attributeId);
            }

            if (!attributeId) continue;

            // Préparer les données pour l'insertion
            for (const key in cleanedRow) {
              if (key.startsWith('value') && cleanedRow[key] !== '') {
                valuesToInsert.push([cleanedRow[key], attributeId]);

                if (valuesToInsert.length >= BATCH_SIZE) {
                  await this.client.query(
                    `INSERT IGNORE INTO value (name, attribute_id) VALUES ?`,
                    [valuesToInsert]
                  );
                  valuesToInsert.length = 0; // Réinitialiser le tableau
                }
              }
            }
            // Yield to conform to async generator requirements
            yield;
          }
        }.bind(this)
      );

      // Dernier flush si nécessaire
      if (valuesToInsert.length > 0) {
        await this.client.query(
          'INSERT IGNORE INTO value (name, attribute_id) VALUES ?',
          [valuesToInsert]
        );
      }
      await this.client.query('COMMIT');
      console.log('File uploaded and processed successfully');

      return {
        noExistingAttributes,
      };
    } catch (error) {
      await this.client.query('ROLLBACK');
      console.error('Transaction error, rolling back:', error);
      throw error;
    }
  }
}
