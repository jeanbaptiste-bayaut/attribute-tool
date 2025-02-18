import CoreController from './core.controller.js';
import { DescriptionDataMapper } from '../datamappers/index.datamapper.js';

export default class DescriptionController extends CoreController {
  static entityName = 'description';
  static mainDataMapper = DescriptionDataMapper;

  static async uloadDescriptionFromCsv(req, res) {
    try {
      if (!req.file) {
        throw new Error('No file uploaded.');
      }

      const filePath = req.file.path;

      const uploadFile = await DescriptionDataMapper.uploadDescriptions(
        filePath
      );

      res.status(200).json(uploadFile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async addComment(req, res) {
    const { comment, style } = req.body;

    try {
      const result = await DescriptionDataMapper.addComment(comment, style);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
