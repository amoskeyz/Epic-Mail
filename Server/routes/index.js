import express from 'express';
import userController from '../controllers/userController';
import messageController from '../controllers/messageController';
import groupController from '../controllers/groupController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const router = express();

router.get('/', userController.welcome);

router.post('/auth/signup', validator.validateSignup, userController.signupUser);
router.post('/auth/login', validator.validateSignin, userController.signinUser);
router.get('/messages', authenticator.authenticateUser, messageController.receivedMessages);
router.get('/messages/unread', authenticator.authenticateUser, messageController.unreadMessages);
router.get('/messages/sent', authenticator.authenticateUser, messageController.sentMessages);
router.get('/messages/:id', validator.validateid, authenticator.authenticateUser, messageController.specificMessage);
router.post('/messages', authenticator.authenticateUser, validator.validateMessage, messageController.composeMessage);
router.delete('/messages/:id', authenticator.authenticateUser, messageController.deleteMessage);
router.post('/group', authenticator.authenticateUser, validator.validateGroup, groupController.createGroup);
router.get('/groups', authenticator.authenticateUser, groupController.groups);
router.patch('/groups/:id/name', authenticator.authenticateUser, groupController.updateGroup);
export default router;
