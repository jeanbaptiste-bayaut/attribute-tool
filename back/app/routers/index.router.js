import { Router } from 'express';
import UserRouter from './user.router.js';
import AttributeRouter from './attribute.router.js';
import DescriptionRouter from './description.router.js';
import ProductRouter from './product.router.js';
import ValueRouter from './value.router.js';
import UploadRouter from './upload.router.js';
import ExportRouter from './export.router.js';
import TmpRouter from './tmp.router.js';
import ImageRouter from './image.router.js';

const router = Router();

router.use(UserRouter);
router.use(AttributeRouter);
router.use(DescriptionRouter);
router.use(ProductRouter);
router.use(ValueRouter);
router.use(UploadRouter);
router.use(ExportRouter);
router.use(TmpRouter);
router.use(ImageRouter);

export default router;
