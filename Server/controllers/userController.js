import token from '../helper/token';
import users from '../models/user';
import pool from '../config/config';


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
    try {
      const output = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const returnemail = output.rows[0];
      if (returnemail !== undefined) {
        return res.status(409).json({
          status: 409,
          data: 'User already exist',
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
      });
    }

    const user = {
      text: `INSERT INTO users(  
      firstname,
      lastname,
      email,
      phoneNumber,
      password)VALUES($1, $2, $3, $4, $5) RETURNING *`,
      values: [firstname, lastname, email, phonenumber, password],
    };
    const userArray = await pool.query(user);
    return res.status(201).json({
      status: 201,
      data: {
        firstname, lastname, email, phonenumber, token: token({ id: userArray.id }),
      },
    });
  }

  static async signinUser(req, res) {
    const {
      email, password,
    } = req.body;
    let id;
    try {
      const output = await pool.query('SELECT * FROM users WHERE (email = $1 AND password  = $2)', [email, password]);
      if (output.rows[0] === undefined) {
        return res.status(400).json({
          status: 400,
          error: 'Invalid User',
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
      });
    }
    return res.status(200).json({
      status: 200,
      data: { token: token({ id }) },
    });
  }
}

export default userController;
