import express from 'express';
import userController from '../controllers/userController';
import validator from '../middleware/validator';

const router = express();

router.get('/', userController.welcome);

router.post('/auth/signup', validator.validateSignup, userController.signupUser);
router.post('/auth/login', validator.validateSignin, userController.signinUser);


export default router;
