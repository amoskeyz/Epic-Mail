import express from 'express';
import Controller from '../Controllers/epicController';
import Validator from '../Middleware/validator';

const router = express();

router.get('/', Controller.welcome);

router.post('/auth/signup', Validator.validateSignup, Controller.signupUser);
router.post('/auth/signin', Validator.validateSignin, Controller.signinUser);
router.get('/messages/received', Controller.receivedMessages);
router.get('/messages/unread', Controller.unreadMessages);
router.get('/messages/sent', Controller.sentMessages);
router.get('/messages/:id', Validator.validateid, Controller.specificMessage);
router.post('/auth/compose', Validator.validateMessage, Controller.composeMessage);

export default router;
