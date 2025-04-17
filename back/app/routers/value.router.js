import { Router } from 'express';
import ValueController from '../controllers/value.controller.js';
import ProductHasAttributeController from '../controllers/product_has_attribute.controller.js';

const router = Router();

router.get(
  '/api/values/name/:id/:name',
  ValueController.getValuesByNameAttributeId.bind(ValueController)
);
router.get('/api/brands', ValueController.getBrandSList.bind(ValueController));
router.get(
  '/api/seasons',
  ValueController.getSeasonsSList.bind(ValueController)
);
router.patch(
  '/api/attributes/status',
  ProductHasAttributeController.updateStatus.bind(ProductHasAttributeController)
);

export default router;
