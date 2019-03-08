import express from 'express';
import Controller from '../Controllers/epicController';
import Validator from '../Middleware/validator';

const router = express();

router.get('/', Controller.welcome);

router.post('/auth/signup', Validator.validateSignup, Controller.signupUser);
router.post('/auth/signin', Validator.validateSignin, Controller.signinUser);
router.get('/messages', Controller.getallreceivedmessages);
router.get('/messages/unread', Controller.getallunreadmessages);

export default router;
