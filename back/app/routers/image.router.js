import { Router } from 'express';
import ImageController from '../controllers/image.controller.js';

const router = Router();

router.get(
  '/api/images/:brand/:pattern/:color',
  ImageController.transformToJson.bind(ImageController)
);

router.get(
  '/api/images/colors/:pattern/',
  ImageController.getOtherColors.bind(ImageController)
);

export default router;
