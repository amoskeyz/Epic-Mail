import pool from '../config/config';
import errorResponse from '../helper/errorResponse';
import query from '../migration/query';

const { messageQueries, userQueries } = query;

class messageController {
  static async receivedMessages(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query(messageQueries.getReceived, [id]);
      if (response.rows[0]) {
        return res.status(200).json({
          status: 200,
          data: response.rows,
        });
      } return errorResponse(404, 'No Message', res);
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async unreadMessages(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query(messageQueries.getUnread, [id, 'unread']);
      if (!response.rows[0]) {
        return errorResponse(400, 'No Unread Message Found', res);
      }
      return res.status(200).json({
        status: 200,
        data: response.rows[0],
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async sentMessages(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query(messageQueries.getSent, [id]);
      if (!response.rows[0]) {
        return errorResponse(400, 'No Sent Message Found', res);
      }
      return res.status(200).json({
        status: 200,
        data: response.rows[0],
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }


  static async specificMessage(req, res) {
    const id = req.decoder;
    const messageId = Number(req.params.id);
    try {
      const response = await pool.query(messageQueries.getSpecific, [id, id]);
      const messageObj = response.rows.find(message => message.id === messageId);
      if (!messageObj) {
        return errorResponse(400, 'Message Not Found', res);
      }
      if (response.rows[0].receiverid === id) {
        const wait = await pool.query(messageQueries.getInboxMessage, [messageId, id]);
        if (wait.rows[0]) {
          return res.status(200).json({
            status: 200,
            data: wait.rows[0],
          });
        } return errorResponse(400, 'Message Not Found', res);
      }
      if (response.rows[0].senderid === id) {
        const wait = await pool.query(messageQueries.getSentMessage, [messageId, id]);
        if (wait.rows[0]) {
          return res.status(200).json({
            status: 200,
            data: wait.rows[0],
          });
        } return errorResponse(400, 'Message Not Found', res);
      }
      return errorResponse(400, 'Message Not Found', res);
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async composeMessage(req, res) {
    const { subject, message, email } = req.body;
    const userId = req.decoder;
    try {
      const response = await pool.query(userQueries.getEmail, [email]);
      if (!response.rows[0]) {
        return errorResponse(404, 'User Does Not Exist', res);
      }
      const receiverid = response.rows[0].id;
      const senderid = userId;
      const status = 'sent';
      const messager = [subject, message, receiverid, receiverid, status, senderid];
      const messageArray = await pool.query(messageQueries.compose, messager);
      const { id } = messageArray.rows[0];
      const inbox = [id, subject, message, receiverid, receiverid, 'Unread', senderid];
      const sent = [id, subject, message, receiverid, receiverid, 'sent', senderid];
      await pool.query(messageQueries.updateInbox, inbox);
      await pool.query(messageQueries.updateSent, sent);
      return res.status(200).json({
        status: 200,
        data: messageArray.rows[0],
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async deleteMessage(req, res) {
    const messageId = Number(req.params.id);
    const id = req.decoder;
    try {
      const response = await pool.query(messageQueries.selectMessage, [id, id, messageId]);
      if (!response.rows[0]) {
        return errorResponse(404, 'Message Does Not Exist', res);
      }
      const { receiverid } = response.rows[0];
      if (receiverid === id) {
        const wait = await pool.query(messageQueries.getInboxMessage, [messageId, id]);
        if (wait.rows[0]) {
          await pool.query(messageQueries.deleteInbox, [messageId, id]);
          return res.status(200).json({
            status: 200,
            data: 'delete successful',
          });
        } return errorResponse(404, 'Message Does Not Exist', res);
      }
      const wait = await pool.query(messageQueries.getSentMessage, [messageId, id]);
      if (wait.rows[0]) {
        await pool.query(messageQueries.deleteSent, [messageId, id]);
        return res.status(200).json({
          status: 200,
          data: 'delete successful',
        });
      } return errorResponse(404, 'Message Does Not Exist', res);
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }
}

export default messageController;
