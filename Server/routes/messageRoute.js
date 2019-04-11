import express from 'express';
import messageController from '../controllers/messageController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const messageRouter = express();

messageRouter.get('/messages', authenticator.authenticateUser, messageController.receivedMessages);
messageRouter.get('/messages/unread', authenticator.authenticateUser, messageController.unreadMessages);
messageRouter.get('/messages/sent', authenticator.authenticateUser, messageController.sentMessages);
messageRouter.get('/messages/:id', validator.validateid, authenticator.authenticateUser, messageController.specificMessage);
messageRouter.post('/messages', authenticator.authenticateUser, validator.validateMessage, messageController.composeMessage);
messageRouter.delete('/messages/:id', authenticator.authenticateUser, messageController.deleteMessage);

export default messageRouter;
