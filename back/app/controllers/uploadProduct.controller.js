import CoreController from './core.controller.js';
import { UploadProductDataMapper } from '../datamappers/index.datamapper.js';

export default class UploadProductController extends CoreController {
  static entityName = 'product';
  static mainDataMapper = UploadProductDataMapper;

  static async uloadProductFromCsv(req, res) {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }

      const filePath = req.file.path;

      const uploadFile = await UploadProductDataMapper.uploadProducts(filePath);

      res.status(200).json(uploadFile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async uploadStylesWithValuesFromCsv(req, res) {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }

      const filePath = req.file.path;

      const uploadFile = await UploadProductDataMapper.uploadStylesWithValues(
        filePath
      );

      res.status(200).json(uploadFile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
