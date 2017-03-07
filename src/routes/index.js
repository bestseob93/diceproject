import express from 'express';

import upload from './upload';
import barcode from './barcode';
import doctor from './doctor';

const router = express.Router();

router.use('/upload', upload);
router.use('/barcode', barcode);
router.use('/doctor', doctor);

export default router;
