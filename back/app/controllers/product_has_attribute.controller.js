import CoreController from './core.controller.js';
import { ProductHasAttributeDataMapper } from '../datamappers/index.datamapper.js';

export default class ProductHasAttributeController extends CoreController {
  static entityName = 'product_has_attribute';
  static mainDataMapper = ProductHasAttributeDataMapper;

  static async updateStatus(req, res) {
    try {
      const { productId, attributeId, valueId } = req.params;

      const result = await ProductHasAttributeDataMapper.updateStatus(
        productId,
        attributeId,
        valueId
      );

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
