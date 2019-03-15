import express from 'express';
import Controller from '../Controllers/epicController';
import Validator from '../Middleware/validator';
import Authenticate from '../Middleware/Auth';

const router = express();

router.get('/', Controller.welcome);

router.post('/auth/signup', Validator.validateSignup, Controller.signupUser);
router.post('/auth/signin', Validator.validateSignin, Controller.signinUser);
router.get('/messages/received', Authenticate.authen, Controller.receivedMessages);
router.get('/messages/unread', Authenticate.authen, Controller.unreadMessages);
router.get('/messages/sent', Authenticate.authen, Controller.sentMessages);
router.get('/messages/:id', Validator.validateid, Authenticate.authen, Controller.specificMessage);
router.post('/auth/compose', Authenticate.authen, Validator.validateMessage, Controller.composeMessage);
router.delete('/messages/:id', Authenticate.authen, Controller.deleteMessage);

export default router;
