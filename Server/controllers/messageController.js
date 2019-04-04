import pool from '../config/config';

class messageController {
  static async receivedMessages(req, res) {
    const id = req.decoder;
    try {
      const response = await pool.query('SELECT created_on, subject, message, parentmessageid, status FROM messages where receiverid = $1', [id]);
      return res.status(200).json({
        status: 200,
        data: response.rows,
      });
    } catch (err) {
      return res.status(500).json({
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
        return res.status(404).json({
          status: 404,
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
      const response = await pool.query('SELECT created_on, subject, message, parentmessageid, status FROM messages where senderid = $1', [id]);
      if (response.rows[0] === undefined) {
        return res.status(404).json({
          status: 404,
          data: 'NO SENT MESSAGE FOUND',
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


  static async specificMessage(req, res) {
    const id = req.decoder;
    const i = Number(req.params.id);
    try {
      const response = await pool.query('SELECT * FROM messages WHERE (receiverid = $1 OR senderid  = $2)', [id, id]);
      const messageObj = response.rows.find(message => message.id === i);
      if (!messageObj) {
        return res.status(404).json({
          status: 400,
          error: 'message not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: messageObj,
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Server Error',
      });
    }
  }

  static async composeMessage(req, res) {
    const { subject, message, email } = req.body;
    const userId = req.decoder;
    try {
      const response = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (response.rows[0] === undefined) {
        return res.status(404).json({
          status: 404,
          data: 'User does not exist',
        });
      }
      const receiverid = response.rows[0].id;
      // const createdon = new Date();
      const senderid = userId;
      const status = 'sent';
      const messager = {
        text: `INSERT INTO messages(  
      subject,
      message,
      parentmessageid,
      receiverid,
      status,
      senderid)VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        values: [subject, message, receiverid, receiverid, status, senderid],
      };
      const mess = await pool.query(messager);
      const { id } = mess.rows[0];

      const inbox = {
        text: `INSERT INTO inbox(  
      message_id,
      subject,
      message,
      parentmessageid,
      receiverid,
      status,
      senderid)VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        values: [id, subject, message, receiverid, receiverid, 'Unread', senderid],
      };
      const sent = {
        text: `INSERT INTO sent(  
      message_id,
      subject,
      message,
      parentmessageid,
      receiverid,
      status,
      senderid)VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        values: [id, subject, message, receiverid, receiverid, 'sent', senderid],
      };
      await pool.query(inbox);
      await pool.query(sent);
      return res.status(200).json({
        status: 200,
        data: mess.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        response: 'Server error',
      });
    }
  }

  static async deleteMessage(req, res) {
    const messageId = Number(req.params.id);
    const id = req.decoder;
    try {
      const response = await pool.query('SELECT senderid, receiverid FROM messages WHERE (senderid = $1 OR receiverid = $2) AND id = $3', [id, id, messageId]);
      if (response.rows[0] === undefined) {
        return res.status(404).json({
          status: 404,
          data: 'Message does not exist',
        });
      }
      const { receiverid } = response.rows[0];
      if (receiverid === id) {
        await pool.query('DELETE FROM inbox WHERE (message_id = $1 AND receiverid = $2)', [messageId, id]);
        return res.status(200).json({
          status: 200,
          data: 'delete successful',
        });
      }
      await pool.query('DELETE FROM sent WHERE (message_id = $1 AND senderid = $2)', [messageId, id]);
      return res.status(200).json({
        status: 200,
        data: 'delete successful',
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        response: 'Server error',
      });
    }
  }
}

export default messageController;
