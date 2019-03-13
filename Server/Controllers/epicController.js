import token from '../Helper/token';
import users from '../Models/user';
import messages from '../Models/messages';

class epicMail {
  static welcome(req, res) {
    return res.status(200).json({
      message: 'Welcome to EPic mail',
    });
  }

  static signupUser(req, res) {
    const {
      firstName, lastName, email, password, phoneNumber,
    } = req.body;
    let isExist = false;
    users.forEach((user) => {
      if (user.email === email) {
        isExist = true;
      }
    });
    if (isExist){
      return res.status(400).json({
        status: 400,
        data: 'User already exist',
      });
    }
    const id = users.length + 1;
    const userObj = {
      id, firstName, lastName, email, password, phoneNumber,
    };
    users.push(userObj);
    return res.status(201).json({
      status: 201,
      data: { firstName, lastName, email, phoneNumber, token: token({ id: userObj.id }) },
    });
  }

  static signinUser(req, res) {
    const {
      email, password,
    } = req.body;
    let isExist = false;
    let id;
    users.forEach((user) => {
      if (user.email === email && user.password === password) {
        isExist = true;
        ({ id } = user);
      }
    });
    if (isExist) {
      return res.status(200).json({
        status: 200,
        data: { Token: token({ id }) },
      });
    }
    return res.status(400).json({
      status: 400,
      error: 'Invalid User',
    });
  }

  static receivedMessages(req, res) {
    return res.status(200).json({
      status: 200,
      data: messages,
    });
  }

  static unreadMessages(req, res) {
    const array = messages.filter(message => message.status === 'unread');
    return res.status(200).json({
      status: 200,
      data: array,
    });
  }

  static sentMessages(req, res) {
    const array = messages.filter(message => message.status === 'sent');
    return res.status(200).json({
      status: 200,
      data: array,
    });
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
      const index = messages.findIndex(message => message.id == id);
      messages.splice(index, 1);
      return res.status(200).json({
        satus: 200,
        data:  { messageObj },
      });
    }
}

export default epicMail;
