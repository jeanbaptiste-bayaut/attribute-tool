import CoreDataMapper from './core.datamapper.js';
import csvParser from 'csv-parser';
import fs from 'fs';

function cleanKeys(obj) {
  const cleanedObj = {};
  for (const key in obj) {
    const cleanedKey = key.trim().replace(/['"]+/g, ''); // Supprime les apostrophes/guillemets et espaces
    cleanedObj[cleanedKey] = obj[key];
  }
  return cleanedObj;
}

export default class UploadProductDataMapper extends CoreDataMapper {
  static tableName = 'product';

  static async uploadProducts(filePath) {
    const results = [];

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
            .includes('style', 'color', 'name', 'image_url', 'season')
        ) {
          throw new Error(
            'header must include "style", "color", "name", "image_url", "season"'
          );
        }
        results.push(cleanedRow);
      }

      console.log('ici');

      const insertQuery = `
      INSERT INTO "product" ("style", "color", "name", "image_url", "season")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;

      for (const row of results) {
        const isStyleExists = await this.client.query(
          `SELECT * FROM "product" WHERE "style"=$1`,
          [row.style]
        );

        if (isStyleExists.rows[0]) {
          throw new Error(`style ${row.style} already exists`);
        }

        await this.client.query(insertQuery, [
          row.style,
          row.color,
          row.name,
          row.image_url,
          row.season,
        ]);
      }
      await this.client.query('COMMIT'); // Valider la transaction

      return { success: 'File uploaded and processed successfully' };
    } catch (error) {
      await this.client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
      throw new Error(error);
    }
  }

  static async uploadStylesWithValues(filePath) {
    try {
      const results = [];
      const promises = [];
      let valueNotFoundList = [];

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser({ separator: ';' }))
          .on('data', (row) => {
            const cleanedRow = cleanKeys(row);
            results.push(cleanedRow);

            promises.push(
              this.client
                .query(`SELECT "id" FROM "product" WHERE "style" = $1;`, [
                  row.style,
                ])
                .then((result) => {
                  if (result.rows.length > 0) {
                    const id = result.rows[0].id;
                    cleanedRow['style_id'] = id;
                  } else {
                    return;
                    // throw new Error('No product found for style: ' + row.style);
                  }
                })
                .catch((err) => {
                  console.error(
                    'No product found for style: ' + row.style,
                    err
                  );
                  throw new Error('No product found for style: ' + row.style);
                })
            );
          })
          .on('end', async () => {
            // Attendre la résolution de toutes les promesses
            try {
              await Promise.all(promises);
              resolve();
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => reject(error));
      });

      // traiter chaque ligne après avoir trouvé les style_id
      for (const row of results) {
        for (const key in row) {
          if (
            key !== 'style' &&
            key !== 'style_id' &&
            row[key] !== '' &&
            row[key] !== 'not_found'
          ) {
            let keyFormatted = key;
            if (keyFormatted.match(/(_\d)/)) {
              keyFormatted = key.slice(0, -2);
            }

            if (row[key].match(/(.+ +)/)) {
              row[key] = row[key].replace(/ +/g, '');
            }

            const attributeId = await this.client.query(
              `SELECT "id" FROM "attribute" WHERE "name" = $1;`,
              [keyFormatted.toLowerCase()]
            );

            if (!attributeId.rows[0]) {
              throw new Error(`No attribute found for "${keyFormatted}".`);
            }

            const valueId = await this.client.query(
              `SELECT "id" FROM "value" WHERE "name" = $1;`,
              [row[key].toLowerCase()]
            );

            if (!valueId.rows[0] || !valueId.rows[0].id) {
              valueNotFoundList.push({
                attribute: keyFormatted,
                value: row[key],
              });
            } else {
              const query = `
              INSERT INTO "product_has_attribute" ("product_id", "attribute_id", "value_id")
              VALUES ($1, $2, $3)
              ON CONFLICT ("product_id", "attribute_id", "value_id") 
              DO NOTHING;`;

              await this.client.query(query, [
                row.style_id,
                attributeId.rows[0].id,
                valueId.rows[0].id,
              ]);
            }
          }
        }
      }
      console.log('File uploaded and processed successfully');
      return valueNotFoundList;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
