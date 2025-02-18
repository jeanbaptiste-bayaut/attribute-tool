import { Router } from 'express';
import AttributeRouter from './attribute.router.js';
import DescriptionRouter from './description.router.js';
import ProductRouter from './product.router.js';
import ValueRouter from './value.router.js';
import UploadRouter from './upload.router.js';
import ExportRouter from './export.router.js';
import TmpRouter from './tmp.router.js';

const router = Router();

router.use(AttributeRouter);
router.use(DescriptionRouter);
router.use(ProductRouter);
router.use(ValueRouter);
router.use(UploadRouter);
router.use(ExportRouter);
router.use(TmpRouter);

export default router;
