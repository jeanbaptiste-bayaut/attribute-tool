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

    const products = [];

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
        } else {
          products.push(cleanedRow.pattern);
        }
        results.push(cleanedRow);
      }

      // const filterNonExistingProducts = await isAlreadyExisting(products);

      const insertQuery = `
      INSERT INTO product (style, color, name, image_url, season)
      VALUES (?, ?, ?, ?, ?);
    `;

      for (const row of results) {
        const [isStyleExists] = await this.client.query(
          `SELECT * FROM product WHERE style=?`,
          [row.style]
        );

        if (isStyleExists[0]) {
          continue;
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
      let attributeNotFoundList = [];
      let productNotFoundList = [];

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser({ separator: ';' }))
          .on('data', (row) => {
            const cleanedRow = cleanKeys(row);
            results.push(cleanedRow);

            promises.push(
              this.client
                .query(`SELECT id FROM product WHERE style = ?;`, [row.style])
                .then((result) => {
                  if (result[0].length > 0) {
                    const id = result[0][0].id;
                    cleanedRow['style_id'] = id;
                  } else {
                    productNotFoundList.push(row.style);
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
          // Vérifier si la clé est un attribut et si les valeurs sont non nulles
          if (
            key !== 'style' &&
            key !== 'style_id' &&
            row[key] !== '' &&
            row[key] !== 'not_found'
          ) {
            // supprimer les _1, _2, et 1, 2 par une chaîne vide
            let keyFormatted = key;
            if (keyFormatted.match(/(_\d)/)) {
              keyFormatted = key.slice(0, -2);
            }

            if (keyFormatted.match(/(.+\d)/)) {
              keyFormatted = key.slice(0, -1);
            }

            // Supprimer les espaces supplémentaires
            if (row[key].match(/(.+ +)/)) {
              row[key] = row[key].replace(/ +/g, '');
            }

            // chercher si l'attribut existe
            const [attributeId] = await this.client.query(
              `SELECT id FROM attribute WHERE name = ?;`,
              [keyFormatted.toLowerCase()]
            );

            // Si l'attribut n'existe pas, l'ajouter à la liste
            if (!attributeId[0]) {
              // vérifier si l'attribut n'a pas déjà été ajouté
              if (
                !attributeNotFoundList.find((item) => item === keyFormatted)
              ) {
                attributeNotFoundList.push(keyFormatted);
              }
            } else {
              const [valueId] = await this.client.query(
                `SELECT id FROM value WHERE name = ?;`,
                [row[key].toLowerCase()]
              );

              if (!valueId[0] || !valueId[0].id) {
                if (
                  !valueNotFoundList.find(
                    (item) =>
                      item.attribute === keyFormatted && item.value === row[key]
                  )
                ) {
                  valueNotFoundList.push({
                    attribute: keyFormatted,
                    value: row[key],
                  });
                }
              } else {
                const query = `
              INSERT IGNORE INTO product_has_attribute (product_id, attribute_id, value_id)
              VALUES (?, ?, ?);`;

                await this.client.query(query, [
                  row.style_id,
                  attributeId[0].id,
                  valueId[0].id,
                ]);
              }
            }
          }
        }
      }
      !valueNotFoundList.length
        ? (valueNotFoundList = 'No Missing Values')
        : valueNotFoundList;
      console.log('File uploaded and processed successfully');
      return { valueNotFoundList, attributeNotFoundList, productNotFoundList };
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
