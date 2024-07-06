import express from 'express';
import { uploadFile } from '../controllers/filesController';

const router = express.Router();

router.post('/', uploadFile);

export default router;
