import CoreController from './core.controller.js';
import { ExportDataMapper } from '../datamappers/index.datamapper.js';

export default class ExportCOntroller extends CoreController {
  static entityName = '';
  static mainDataMapper = ExportDataMapper;

  static async getStylesWithAttributeToEdit(req, res) {
    const { season } = req.params;
    try {
      const result = await ExportDataMapper.findStyleWithAttributeToEdit(
        season
      );

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getStylesWithDescriptionComment(req, res) {
    const { season } = req.params;
    try {
      const result = await ExportDataMapper.findStyleWithDescriptionComment(
        season
      );

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
