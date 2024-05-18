import express from 'express';
const router = express.Router();
import AuthController from '../controllers/Auth';

const authController = new AuthController();

router.route('/users').get(authController.getUsers);

export default router;
