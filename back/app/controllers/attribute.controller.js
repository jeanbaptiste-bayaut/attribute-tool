import CoreController from './core.controller.js';
import { AttributeDataMapper } from '../datamappers/index.datamapper.js';

export default class DescriptionController extends CoreController {
  static entityName = 'attribute';
  static mainDataMapper = AttributeDataMapper;

  static async uloadAttributesFromCsv(req, res) {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }

      const filePath = req.file.path;

      const uploadFile = await AttributeDataMapper.uploadAttributes(filePath);

      res.status(200).json(uploadFile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async uloadValuesFromCsv(req, res) {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }

      const filePath = req.file.path;

      const uploadFile = await AttributeDataMapper.uploadAttributesValues(
        filePath
      );

      res.status(200).json(uploadFile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
