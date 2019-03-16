import token from '../helper/token';
import users from '../models/user';


class userController {
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
    if (isExist) {
      return res.status(409).json({
        status: 409,
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
      data: {
        firstName, lastName, email, phoneNumber, token: token({ id: userObj.id }),
      },
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
        data: { token: token({ id }) },
      });
    }
    return res.status(400).json({
      status: 400,
      error: 'Invalid User',
    });
  }
}

export default userController;
