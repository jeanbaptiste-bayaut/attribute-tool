import CoreController from './core.controller.js';
import { ValueDataMapper } from '../datamappers/index.datamapper.js';

export default class DescriptionController extends CoreController {
  static entityName = 'value';
  static mainDataMapper = ValueDataMapper;

  static async getValuesByNameAttributeId(req, res) {
    try {
      const { id, name } = req.params;

      const result = await ValueDataMapper.findByNameAndAttributeid(id, name);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getBrandSList(req, res) {
    try {
      const result = await ValueDataMapper.findDivisions();

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getSeasonsSList(req, res) {
    try {
      const result = await ValueDataMapper.findSeasons();

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getValuesByAttribute(req, res) {
    try {
      const { name } = req.params;

      const result = await ValueDataMapper.findValuesByAttribute(name);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async findParentTypesPerBrand(req, res) {
    try {
      const { brand } = req.params;

      const result = await ValueDataMapper.findParentTypesPerBrand(brand);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
