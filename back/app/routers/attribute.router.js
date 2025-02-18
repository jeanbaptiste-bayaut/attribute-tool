import { Router } from 'express';
import ProductController from '../controllers/product.controller.js';
import AttributeController from '../controllers/attribute.controller.js';

const router = Router();

router.get(
  '/api/attributes/:id',
  ProductController.getAttributesByProduct.bind(ProductController)
);
router.get(
  '/api/attributes/name/:name',
  AttributeController.getByName.bind(AttributeController)
);

export default router;
