import fs from 'fs';
import path from 'path';
import csv2json from 'csvtojson';
import { getProduct } from '../cache/imagesCache.js';

const __dirname = path.resolve();

export default class ImageController {
  static async transformToJson(req, res) {
    const { brand, pattern, color } = req.params;

    try {
      const product = getProduct(brand, pattern, color);

      const imageList = [];

      for (const key in product) {
        if (key.startsWith('image') && product[key]) {
          imageList.push({ name: product[key] });
        }
      }

      res.json(imageList);
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
