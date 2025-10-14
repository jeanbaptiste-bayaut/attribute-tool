import { Router } from 'express';
import DescriptionController from '../controllers/description.controller.js';
import AttributeController from '../controllers/attribute.controller.js';
import UploadProductController from '../controllers/uploadProduct.controller.js';
import { upload, handleMulterError } from '../middleware/multerConfig.js';

const router = Router();

router.post(
  '/upload/descriptions',
  upload.single('descriptions'),
  handleMulterError,
  DescriptionController.uloadDescriptionFromCsv.bind(DescriptionController)
);
router.post(
  '/upload/attributes',
  upload.single('attributes'),
  handleMulterError,
  AttributeController.uloadAttributesFromCsv.bind(AttributeController)
);
router.post(
  '/upload/attributes/values',
  upload.single('attributes-values'),
  handleMulterError,
  AttributeController.uloadValuesFromCsv.bind(AttributeController)
);
router.post(
  '/upload/products/attributes/values',
  upload.single('products-attributes-values'),
  handleMulterError,
  UploadProductController.uploadStylesWithValuesFromCsv.bind(
    UploadProductController
  )
);
router.post(
  '/upload/products',
  upload.single('products'),
  handleMulterError,
  UploadProductController.uloadProductFromCsv.bind(UploadProductController)
);

export default router;
