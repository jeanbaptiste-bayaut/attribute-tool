import { Router } from 'express';
import UserController from '../controllers/user.controller.js';

const router = Router();

router.get('/api/user/:id/', UserController.getUserById.bind(UserController));
router.get('/api/user/', UserController.getUserByEmail.bind(UserController));
router.post('/api/user/login', UserController.login.bind(UserController));
router.post('/api/user/signin', UserController.createUser.bind(UserController));

router.get(
  '/api/user/index/:id/',
  UserController.getIndexByUser.bind(UserController)
);

router.patch(
  '/api/user/index',
  UserController.updateIndexByUser.bind(UserController)
);

export default router;
