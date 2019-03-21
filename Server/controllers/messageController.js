import { pathToFileURL } from 'url';
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
      const messageObj = response.rows.find(message => message.i === i);
      if (!messageObj) {
        return res.status(400).json({
          status: 'Error',
          error: 'message not found',
        });
      }
      return res.status(200).json({
        status: 'Successful',
        data: messageObj,
      });
    } catch (err) {
      return res.status(500).json({
        status: 'Error',
        error: 'Server Error',
      });
    }
  }

  // static specificMessage(req, res) {
  //   const messageObj = messages.find(message => message.id
  //       === Number(req.params.id));
  //   if (messageObj) {
  //     return res.status(200).json({
  //       status: 200,
  //       data: messageObj,
  //     });
  //   }
  //   return res.status(400).json({
  //     status: 400,
  //     error: 'message not found',
  //   });
  // }

  static async composeMessage(req, res) {
    const { subject, message, email } = req.body;
    const id = req.decoder;
    try {
      const response = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (response.rows[0] === undefined) {
        return res.status(409).json({
          status: 'Error',
          data: 'User does not exist',
        });
      }
      const receiverid = response.rows[0].id;
      const createdon = new Date();
      const senderid = id;
      const status = 'draft';
      const messager = {
        text: `INSERT INTO messages(  
      createdon,
      subject,
      email,
      message,
      parentmessageid,
      receiverid,
      status,
      senderid)VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        values: [createdon, subject, email, message, receiverid, receiverid, status, senderid],
      };
      const mess = await pool.query(messager);
      return res.status(200).json({
        status: 200,
        data: mess.rows[0],
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: 500,
        response: 'Server error',
      });
    }
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
