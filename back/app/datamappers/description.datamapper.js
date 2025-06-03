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
  static languageMapping = [
    { code: 'master', locale: 'english' },
    { code: 'fr', locale: 'french' },
    { code: 'de', locale: 'german' },
    { code: 'it', locale: 'italian' },
    { code: 'es', locale: 'spanish' },
    { code: 'nl', locale: 'dutch' },
    { code: 'pt', locale: 'portuguese' },
  ];

  static async uploadDescriptions(filePath) {
    const results = [];

    try {
      await this.client.query('BEGIN'); // Commencer une transaction

      const readStream = fs
        .createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }));

      for await (const row of readStream) {
        // Vérifier si les clés sont présentes dans l'en-tête
        if (
          !Object.keys(row).includes(
            'ModesCode',
            'LabelWeb',
            'ActiveLanguage',
            'DescriptionLong',
            'Characteristics',
            'composition',
            'type'
          )
        ) {
          throw new Error(
            'header must include "ModesCode", "LabelWeb", "ActiveLanguage", "DescriptionLong", "Characteristics", "composition", "type"'
          );
        }

        const cleanedRow = cleanKeys(row);
        results.push(cleanedRow);
      }

      for (const row of results) {
        const [isStyleExists] = await this.client.query(
          `SELECT id FROM product WHERE style=?`,
          [row.ModesCode]
        );

        if (!isStyleExists[0]) {
          throw new Error(`style ${row.ModesCode} does not exist`);
        }

        const { locale } = this.languageMapping.find(
          (lang) => lang.code === row.ActiveLanguage
        );

        if (!locale) {
          throw new Error(`Language ${row.ActiveLanguage} not supported`);
        }

        const insertQuery = `
        INSERT INTO ${locale} (label, product_type, product_description, product_characteristic, product_composition, product_id)
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

      return { success: 'File uploaded and processed successfully' };
    } catch (error) {
      await this.client.query('ROLLBACK'); // Annuler la transaction en cas d'erreur
      throw new Error(error);
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

  static async getLocaleStatus(product) {
    const [result] = await this.client.query(
      `SELECT 
        product.style, 
        english.status as master, 
        french.status as fr, 
        spanish.status as es, 
        dutch.status as nl, 
        portuguese.status as pt, 
        german.status as de, 
        italian.status as it
      FROM product
        JOIN english on product.id = english.product_id
        JOIN french on  product.id = french.product_id
        JOIN spanish on product.id = spanish.product_id
        JOIN dutch on product.id = dutch.product_id
        JOIN portuguese on product.id = portuguese.product_id
        JOIN german on product.id = german.product_id
        JOIN italian on product.id = italian.product_id
      WHERE product.style = ?;`,
      [product]
    );

    if (result.length === 0) {
      throw new Error(`No locale status found for product ${product}`);
    }

    return result[0];
  }
}
