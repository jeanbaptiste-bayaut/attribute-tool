import { Router } from 'express';
import tmpDisplay from '../service/tmpDisplay.js';

const router = Router();

router.get('/api/tmp/upload', tmpDisplay.displayTmp);

export default router;
