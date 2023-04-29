import { Router } from 'express';
const router = Router();

import { tokenMiddleware } from './middlewares/token.js';


import users from './routes/users.js';
import auth from './routes/auth.js';
import group from './routes/group.js';


router.use('/users', users);
router.use('/auth', auth);
router.use('/group', tokenMiddleware.check, group);

export default router;