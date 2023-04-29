import { Router } from 'express';
const router = Router();

import { tokenMiddleware } from './middlewares/token.js';


import users from './routes/users.js';
import auth from './routes/auth.js';


router.use('/users', users);
router.use('/auth', auth);

export default router;