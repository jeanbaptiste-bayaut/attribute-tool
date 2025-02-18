import { Router } from 'express';
import DescriptionController from '../controllers/description.controller.js';

const router = Router();

router.post(
  '/api/descriptions/comment',
  DescriptionController.addComment.bind(DescriptionController)
);

export default router;
