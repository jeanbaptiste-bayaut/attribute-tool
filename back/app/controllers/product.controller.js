import CoreController from './core.controller.js';
import { ProductDataMapper } from '../datamappers/index.datamapper.js';

export default class ProductController extends CoreController {
  static entityName = 'product';
  static mainDataMapper = ProductDataMapper;

  static async getAttributesByProduct(req, res) {
    try {
      const { id } = req.params;

      const result = await ProductDataMapper.findProductWithAttributeByPk(id);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllProducts(req, res) {
    const { brand, season } = req.params;

    try {
      const result = await ProductDataMapper.findAllProducts(brand, season);

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async validateProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductDataMapper.switchProductStatus(id);

      res
        .status(200)
        .json({ message: `product ${result.style} has been validated` });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
