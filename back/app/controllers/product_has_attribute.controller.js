import CoreController from './core.controller.js';
import { ProductHasAttributeDataMapper } from '../datamappers/index.datamapper.js';

export default class ProductHasAttributeController extends CoreController {
  static entityName = 'product_has_attribute';
  static mainDataMapper = ProductHasAttributeDataMapper;

  static async updateStatus(req, res) {
    try {
      const { attributes } = req.body;

      attributes.map((attr) => {
        if (attr.status == true || attr.status == false) {
          attr.status === false ? (attr.status = 0) : (attr.status = 1);
        } else return;
      });

      const result = await ProductHasAttributeDataMapper.updateStatus(
        attributes
      );

      res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
