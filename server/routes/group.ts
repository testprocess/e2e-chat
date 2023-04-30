import { Router } from 'express';
import { tokenMiddleware } from '../middlewares/token.js';
import { groupController } from '../controllers/group.ctrl.js';

const router = Router();

router.post('/', groupController.create);
router.delete('/:uuid', groupController.delete);
router.get('/', groupController.read);
router.post('/join/:uuid', groupController.join);


export default router;