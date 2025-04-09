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
      INSERT INTO "attribute" ("name")
      VALUES ($1)
      RETURNING id;
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
    try {
      const results = [];
      const selectPromises = [];

      await pipelineAsync(
        fs.createReadStream(filePath),
        csvParser({ separator: ';' }).on('data', (row) => {
          console.log(row);

          const cleanedRow = cleanKeys(row);
          results.push(cleanedRow);

          selectPromises.push(
            this.client
              .query(`SELECT "id" FROM "attribute" WHERE "name" = $1;`, [
                row.attribute,
              ])
              .then((result) => {
                if (result.rows.length > 0) {
                  const id = result.rows[0].id;
                  cleanedRow['attribute_id'] = id;
                } else {
                  throw new Error(
                    `No existing attribute for: ${row.attribute}`
                  );
                }
              })
              .catch((error) => {
                console.error(
                  `Erreur lors de la récupération de l'id de l'attribut: ${row.attribute}`,
                  error
                );
                throw error;
              })
          );
        })
      );

      await Promise.all(selectPromises);

      await this.client.query('BEGIN');
      try {
        const queryInsert = `
          INSERT INTO "value" ("name", "attribute_id") 
          VALUES ($1, $2)
          ON CONFLICT ("name", "attribute_id") 
          DO NOTHING
          RETURNING id;`;

        const queryCheckIfExists = `SELECT "id" FROM "value" WHERE "name" = $1 AND "attribute_id" = $2`;

        const insertPromises = [];
        const existingValues = [];

        for (const row of results) {
          for (const key in row) {
            if (key.startsWith('value') && row[key] !== '') {
              const checkIfExists = await this.client.query(
                queryCheckIfExists,
                [row[key], row.attribute_id]
              );
              if (checkIfExists.rows.length === 0) {
                console.log(
                  `Attempting to insert: ${row[key]} with attribute_id: ${row.attribute_id}`
                );
                insertPromises.push(
                  this.client
                    .query(queryInsert, [row[key], row.attribute_id])
                    .then((res) => {
                      if (res.rows.length > 0) {
                        console.log(
                          `Successfully inserted: ${row[key]}, assigned ID: ${res.rows[0].id}`
                        );
                      } else {
                        console.warn(
                          `Insert was skipped for duplicate: ${row[key]} with attribute_id: ${row.attribute_id}`
                        );
                      }
                    })
                    .catch((error) =>
                      console.error(`Failed to insert ${row[key]}:`, error)
                    )
                );
              } else {
                existingValues.push({
                  attribute: row.attribute,
                  value: row[key],
                });
                console.log(
                  `Skipped existing: ${row[key]}, attribute_id: ${row.attribute_id}`
                );
              }
            }
          }
        }

        const insertResults = await Promise.allSettled(insertPromises);

        const successfulInserts = insertResults.filter(
          (r) => r.status === 'fulfilled'
        ).length;
        const failedInserts = insertResults.filter(
          (r) => r.status === 'rejected'
        ).length;
        console.log(`Total attempted inserts: ${insertPromises.length}`);
        console.log(`Successful inserts: ${successfulInserts}`);
        console.log(`Failed inserts: ${failedInserts}`);

        await this.client.query('COMMIT');
        console.log('File uploaded and processed successfully');
        return { existingValues };
      } catch (error) {
        await this.client.query('ROLLBACK');
        console.error('Transaction error, rolling back:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error processing the file:', error);
      throw error;
    }
  }
}
