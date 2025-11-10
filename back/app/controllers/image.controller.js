import fs from 'fs';
import path from 'path';
import csv2json from 'csvtojson';

const __dirname = path.resolve();

export default class ImageController {
  static async transformToJson(req, res) {
    const { brand, pattern, color } = req.params;

    try {
      const file = fs
        .readdirSync(path.join(__dirname, 'app/data'))
        .find((file) => file.endsWith('.csv'));

      const filePath = path.join(__dirname, 'app/data', file);

      let jsonArray = await csv2json({
        noheader: false,
        delimiter: ';',
      }).fromFile(filePath);

      const productInfo = jsonArray.find(
        (product) =>
          product.brand === brand &&
          product.pattern === pattern &&
          product.color === color
      );

      const imagesList = [];

      for (const key in productInfo) {
        if (key.startsWith('image') && productInfo[key]) {
          imagesList.push({ name: productInfo[key] });
        }
      }

      res.json(imagesList);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }

  static async getOtherColors(req, res) {
    const { pattern } = req.params;
    try {
      const file = fs
        .readdirSync(path.join(__dirname, 'app/data'))
        .find((file) => file.endsWith('.csv'));

      const filePath = path.join(__dirname, 'app/data', file);

      const jsonArray = await csv2json({
        noheader: false,
        delimiter: ';',
      }).fromFile(filePath);

      const listOfMaterilas = jsonArray.map((product) => {
        return { pattern: product.pattern, color: product.color };
      });

      const otherColors = listOfMaterilas.filter((product) => {
        return product.pattern === pattern;
      });

      res.json(otherColors);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  }
}
