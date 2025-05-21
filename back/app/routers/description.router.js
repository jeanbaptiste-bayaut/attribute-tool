import { Router } from 'express';
import DescriptionController from '../controllers/description.controller.js';

const router = Router();

router.get(
  '/api/descriptions/:locale/:style',
  DescriptionController.getDecriptionByLocaleByStyle.bind(DescriptionController)
);

router.get(
  '/api/descriptions/comment/:style',
  DescriptionController.getCommentByStyle.bind(DescriptionController)
);

router.post(
  '/api/descriptions/comment',
  DescriptionController.addComment.bind(DescriptionController)
);

export default router;
