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
      firstname, lastname, email, password,
    } = req.body;
    const id = users.length + 1;
    const userObj = {
      id, firstname, lastname, email, password,
    };
    users.push(userObj);
    return res.status(200).json({
      status: 200,
      data: { Token: token({ id: userObj.id }) },
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

  static getallreceivedmessages(req, res) {
    return res.status(200).json({
      status: 200,
      data: messages,
    });
  }
}

export default epicMail;
