import express from 'express';
import userController from '../controllers/userController';
import messageController from '../controllers/messageController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const router = express();

router.get('/', userController.welcome);

router.post('/auth/signup', validator.validateSignup, userController.signupUser);
router.post('/auth/signin', validator.validateSignin, userController.signinUser);
router.get('/messages/received', authenticator.authenticateUser, messageController.receivedMessages);
router.get('/messages/unread', authenticator.authenticateUser, messageController.unreadMessages);
router.get('/messages/sent', authenticator.authenticateUser, messageController.sentMessages);
router.get('/messages/:id', validator.validateid, authenticator.authenticateUser, messageController.specificMessage);
router.post('/auth/compose', authenticator.authenticateUser, validator.validateMessage, messageController.composeMessage);
router.delete('/messages/:id', authenticator.authenticateUser, messageController.deleteMessage);

export default router;
