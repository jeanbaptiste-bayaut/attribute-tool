import { Router } from 'express';
import ExportController from '../controllers/export.controller.js';

const router = Router();

router.get(
  '/api/export/attributes/:brand/:season',
  ExportController.getStylesWithAttributeToEdit.bind(ExportController)
);

router.get(
  '/api/export/descriptions/:brand/:season',
  ExportController.getStylesWithDescriptionComment.bind(ExportController)
);

export default router;
