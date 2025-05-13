import CoreDataMapper from './core.datamapper.js';
import csvParser from 'csv-parser';
import fs from 'fs';

// Fonction pour nettoyer les clés de l'objet
function cleanKeys(obj) {
  const cleanedObj = {};
  for (const key in obj) {
    const cleanedKey = key.trim().replace(/['"]+/g, ''); // Supprime les apostrophes/guillemets et espaces
    cleanedObj[cleanedKey] = obj[key];
  }
  return cleanedObj;
}

export default class DescriptionDataMapper extends CoreDataMapper {
  static tableName = 'description';

  static async uploadDescriptions(filePath) {
    const results = [];
    const styleWithDescriptionId = [];

    try {
      await this.client.query('BEGIN'); // Commencer une transaction

      const readStream = fs
        .createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }));

      for await (const row of readStream) {
        const cleanedRow = cleanKeys(row);

        if (
          !Object.keys(cleanedRow)[0]
            .split(',')
            .includes('style', 'description')
        ) {
          throw new Error('header must include "style" and "description"');
        }
        results.push(cleanedRow);
      }

      const insertQuery = `
        INSERT INTO description (description, style)
        VALUES (?, ?);
      `;

      for (const row of results) {
        const [isStyleExists] = await this.client.query(
          `SELECT * FROM product WHERE style=?`,
          [row.style]
        );

        if (!isStyleExists[0]) {
          throw new Error(`style ${row.style} does not exist`);
        }
        await this.client.query(insertQuery, [row.description, row.style]);
      }

      const [resultSelectDescStyleId] = await this.client.query(`
        SELECT product.style, description.id 
        FROM product
        JOIN description ON product.style = description.style;
      `);

      styleWithDescriptionId.push(...resultSelectDescStyleId);

      const updateDescIdInProductQuery = `
        UPDATE product
        SET description_id = ?
        WHERE style = ?;
      `;

      for (const row of styleWithDescriptionId) {
        await this.client.query(updateDescIdInProductQuery, [
          row.id,
          row.style,
        ]);
      }

      await this.client.query('COMMIT'); // Valider la transaction

      return { success: 'File uploaded and processed successfully' };
    } catch (error) {
      await this.client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
      throw new Error(error);
    }
  }

  static async getCommentByStyle(style) {
    const [result] = await this.client.query(
      `SELECT comment 
      FROM ${this.tableName}
      WHERE style=?;`,
      [style]
    );

    return result[0];
  }

  static async addComment(comment, style) {
    const [result] = await this.client.query(
      `UPDATE ${this.tableName} SET comment = ?
      WHERE style=?;`,
      [comment, style]
    );

    return result[0];
  }
}
