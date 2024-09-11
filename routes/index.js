import express from 'express';
import UsersController from '../controllers/UsersController';

const router = express.Router();

router.post('/users', UsersController.createUser);
router.get('/users/:id', UsersController.findUserById);
router.delete('/users/:id', UsersController.delUser);
router.put('/users/:id', UsersController.updateUser);

export default router;
