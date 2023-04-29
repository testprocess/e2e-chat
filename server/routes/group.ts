import { Router } from 'express';
import { tokenMiddleware } from '../middlewares/token.js';
import { groupController } from '../controllers/group.ctrl.js';

const router = Router();

router.post('/', groupController.create);


export default router;