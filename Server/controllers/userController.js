import token from '../helper/token';
import errorResponse from '../helper/errorResponse';
import secure from '../helper/encrypt';
import pool from '../config/config';
import query from '../migration/query';

const { userQueries } = query;

class userController {
  static welcome(req, res) {
    return res.status(200).json({
      message: 'Welcome to EPic mail',
    });
  }

  static async signupUser(req, res) {
    const {
      firstname, lastname, email, password, phonenumber,
    } = req.body;
    const passwordhash = secure.encrypt(password);
    try {
      const output = await pool.query(userQueries.getEmail, [email]);
      if (output.rows[0]) {
        return errorResponse(400, 'User already exist', res);
      }
      const user = [firstname, lastname, email, phonenumber, passwordhash];
      const userArray = await pool.query(userQueries.insertUser, user);
      const { id } = userArray.rows[0];
      return res.status(201).json({
        status: 201,
        data: {
          firstname, lastname, email, phonenumber, token: token({ id }),
        },
      });
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }

  static async signinUser(req, res) {
    const {
      email, password,
    } = req.body;
    try {
      const output = await pool.query(userQueries.getEmail, [email]);
      if (!output.rows[0]) {
        return errorResponse(400, 'Invalid User', res);
      }
      const passwordStat = secure.compare(password, output.rows[0].password);
      if (passwordStat) {
        const { id } = output.rows[0];
        return res.status(202).json({
          status: 'Login Successful',
          data: { token: token({ id }) },
        });
      } return errorResponse(400, 'Incorrect Password', res);
    } catch (err) {
      return errorResponse(500, 'Server Error', res);
    }
  }
}

export default userController;
