import { Router } from 'express';
import ProductController from '../controllers/product.controller.js';

const router = Router();

router.get('/api/products/', ProductController.getAll.bind(ProductController));
router.get(
  '/api/products/:brand/:season',
  ProductController.getAllProducts.bind(ProductController)
);
router.patch(
  '/api/products/:id',
  ProductController.validateProduct.bind(ProductController)
);

export default router;
