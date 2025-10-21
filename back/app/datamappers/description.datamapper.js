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
  // static languageMapping = [
  //   { code: 'master', locale: 'english' },
  //   { code: 'fr', locale: 'french' },
  //   { code: 'de', locale: 'german' },
  //   { code: 'it', locale: 'italian' },
  //   { code: 'es', locale: 'spanish' },
  //   { code: 'nl', locale: 'dutch' },
  //   { code: 'pt', locale: 'portuguese' },
  // ];

  static async uploadDescriptions(filePath) {
    const results = [];

    try {
      await this.client.query('BEGIN'); // Commencer une transaction

      const readStream = fs
        .createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }));

      for await (const row of readStream) {
        // Vérifier si les clés correspondent exactement aux en-têtes requis
        const requiredHeaders = [
          'ModesCode',
          'LabelWeb',
          'ActiveLanguage',
          'DescriptionLong',
          'Characteristics',
          'composition',
          'type',
        ];
        const actualHeaders = Object.keys(row);

        // Vérifier que tous les headers requis sont présents
        const missingHeaders = requiredHeaders.filter(
          (header) => !actualHeaders.includes(header)
        );
        if (missingHeaders.length > 0) {
          throw new Error(
            `Missing required headers: ${missingHeaders.join(
              ', '
            )}. Required headers: ${requiredHeaders.join(', ')}`
          );
        }

        // Vérifier qu'il n'y a pas de headers supplémentaires
        const extraHeaders = actualHeaders.filter(
          (header) => !requiredHeaders.includes(header)
        );
        if (extraHeaders.length > 0) {
          throw new Error(
            `Unexpected headers found: ${extraHeaders.join(
              ', '
            )}. Only allowed headers: ${requiredHeaders.join(', ')}`
          );
        }

        const cleanedRow = cleanKeys(row);
        results.push(cleanedRow);
      }

      const productNotFoundList = [];
      for (const row of results) {
        const [isStyleExists] = await this.client.query(
          `SELECT id FROM product WHERE style=?`,
          [row.ModesCode]
        );

        if (!isStyleExists[0]) {
          productNotFoundList.push(row.ModesCode);
          continue;
        }

        const isLocale = this.languageMapping.find(
          (lang) => lang.code === row.ActiveLanguage
        );

        if (!isLocale) {
          throw new Error(`Language ${row.ActiveLanguage} not supported`);
        }

        const { locale } = isLocale;

        const insertQuery = `
        INSERT IGNORE INTO ${locale} (label, product_type, product_description, product_characteristic, product_composition, product_id)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

        await this.client.query(insertQuery, [
          row.LabelWeb,
          row.type,
          row.DescriptionLong,
          row.Characteristics,
          row.composition,
          isStyleExists[0].id,
        ]);
      }

      await this.client.query('COMMIT'); // Valider la transaction

      return {
        productNotFoundList,
      };
    } catch (error) {
      console.log(error);
      await this.client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
      throw error;
    }
  }

  static async getDecriptionByLocaleByStyle(locale, style) {
    try {
      const [productId] = await this.client.query(
        `SELECT id FROM product WHERE style=?`,
        [style]
      );

      const [result] = await this.client.query(
        `SELECT * FROM ${locale} WHERE product_id = ?;`,
        [productId[0].id]
      );

      if (result.length === 0) {
        return {
          message: `No description found for style ${style} in locale ${locale}`,
        };
      }

      return result[0];
    } catch (error) {
      throw new Error(
        `Error fetching descriptions for locale ${locale}: ${error.message}`
      );
    }
  }

  static async getCommentByStyle(style) {
    const [result] = await this.client.query(
      `SELECT comment 
      FROM comment
      WHERE product_id = (SELECT id FROM product WHERE style = ?);`,
      [style]
    );

    return result[0];
  }

  static async addComment({
    style,
    comment,
    english,
    french,
    german,
    spanish,
    italian,
    portuguese,
    dutch,
  }) {
    const [result] = await this.client.query(
      `INSERT INTO comment (product_id, comment, english, french, german, spanish, italian, portuguese, dutch)
      VALUES ((SELECT id FROM product WHERE style = ?), ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        style,
        comment,
        english,
        french,
        german,
        spanish,
        italian,
        portuguese,
        dutch,
      ]
    );

    return result[0];
  }

  static async updateLocaleStatus(locale, status, product) {
    const localeMapped = this.languageMapping.find(
      (lang) => lang.code === locale
    );

    try {
      const [result] = await this.client.query(
        `UPDATE ${localeMapped.locale} SET status = ? WHERE product_id = (SELECT id FROM product WHERE style = ?);`,
        [status, product]
      );

      return result[0];
    } catch (error) {
      throw new Error(
        `Error updating locale status for ${locale} and product ${product}: ${error.message}`
      );
    }
  }

  static async getLocaleStatus(locale, style) {
    const [result] = await this.client.query(
      `SELECT id, status from ${locale} WHERE product_id = (SELECT id from product where style = ?);`,
      [style]
    );

    return result[0];
  }
}
