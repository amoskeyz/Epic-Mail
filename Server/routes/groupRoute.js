import express from 'express';
import groupController from '../controllers/groupController';
import validator from '../middleware/validator';
import authenticator from '../middleware/authentication';

const groupRouter = express();

groupRouter.post('/group', authenticator.authenticateUser, validator.validateGroup, groupController.createGroup);
groupRouter.get('/groups', authenticator.authenticateUser, groupController.groups);
groupRouter.patch('/groups/:id/name', authenticator.authenticateUser, groupController.updateGroup);
groupRouter.delete('/groups/:id', authenticator.authenticateUser, groupController.deleteGroup);
groupRouter.post('/groups/:id/users', authenticator.authenticateUser, validator.validateUser, groupController.addUser);
groupRouter.delete('/groups/:groupId/users/:userId', authenticator.authenticateUser, groupController.deleteUser);
groupRouter.post('/groups/:groupId/messages', authenticator.authenticateUser, groupController.messageGroup);

export default groupRouter;
