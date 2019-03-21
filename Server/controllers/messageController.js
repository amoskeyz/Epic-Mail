import messages from '../models/messages';
import pool from '../config/config';

class messageController {
  static async receivedMessages(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query('SELECT createdon, subject, message, parentmessageid, status FROM messages where receiverid = $1', [id]);
      return res.status(200).json({
        status: 200,
        data: response.rows,
      });
    } catch (err) {
      return res.status(400).json({
        status: 500,
        response: 'Server error',
      });
    }
  }

  static async unreadMessages(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query('SELECT * FROM messages WHERE (receiverid = $1 AND status  = $2)', [id, 'unread']);
      if (response.rows[0] === undefined) {
        return res.status(400).json({
          status: 'Error',
          data: 'NO UNREAD MESSAGE FOUND',
        });
      }
      return res.status(200).json({
        status: 200,
        data: response.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        response: 'Server error',
      });
    }
  }

  static async sentMessages(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query('SELECT createdon, subject, message, parentmessageid, status FROM messages where senderid = $1', [id]);
      if (response.rows[0] === undefined) {
        return res.status(400).json({
          status: 'Error',
          data: 'NO SENT MESSAGE FOUND',
        });
      }
      return res.status(200).json({
        status: 200,
        data: response.rows[0],
      });
    } catch (err) {
      return res.status(505).json({
        status: 500,
        response: 'Server error',
      });
    }
  }


  static specificMessage(req, res) {
    const messageObj = messages.find(message => message.id
        === Number(req.params.id));
    if (messageObj) {
      return res.status(200).json({
        status: 200,
        data: messageObj,
      });
    }
    return res.status(400).json({
      status: 400,
      error: 'message not found',
    });
  }

  static composeMessage(req, res) {
    const {
      subject, message, parentMessageId, status, senderId, receiverId,
    } = req.body;
    const id = messages.length + 1;
    const createdOn = new Date();
    const textObj = {
      id, subject, message, parentMessageId, status, createdOn, senderId, receiverId,
    };
    messages.push(textObj);
    return res.status(200).json({
      status: 200,
      data: {
        id, createdOn, subject, message, parentMessageId, status,
      },
    });
  }

  static deleteMessage(req, res) {
    const messageId = req.params.id;
    const messageObj = messages.find(message => message.id === Number(req.params.id));
    if (!messageObj) {
      return res.status(404).json({
        status: 404,
        error: 'message not found',
      });
    }

    const id = parseInt(messageId);
    const index = messages.findIndex(message => message.id === id);
    messages.splice(index, 1);
    return res.status(200).json({
      satus: 200,
      data: { messageObj },
    });
  }
}

export default messageController;
