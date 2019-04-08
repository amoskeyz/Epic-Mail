import token from '../helper/token';
import secure from '../helper/encrypt';
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
    const passwordhash = secure.encrypt(password);
    try {
      const output = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const returnemail = output.rows[0];
      if (returnemail) {
        return res.status(400).json({
          status: '400',
          data: 'User already exist',
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Server Error',
      });
    }

    const user = {
      text: `INSERT INTO users(  
      firstname,
      lastname,
      email,
      phoneNumber,
      password)VALUES($1, $2, $3, $4, $5) RETURNING *`,
      values: [firstname, lastname, email, phonenumber, passwordhash],
    };
    const userArray = await pool.query(user);
    const { id } = userArray.rows[0];
    return res.status(201).json({
      status: 201,
      data: {
        firstname, lastname, email, phonenumber, token: token({ id }),
      },
    });
  }

  static async signinUser(req, res) {
    const {
      email, password,
    } = req.body;
    try {
      const output = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!output.rows[0]) {
        return res.status(400).json({
          status: '400',
          error: 'Invalid User',
        });
      }
      const passwordStat = secure.compare(password, output.rows[0].password);
      if (passwordStat) {
        const { id } = output.rows[0];
        return res.status(202).json({
          status: '202',
          data: { token: token({ id }) },
        });
      } return res.status(400).json({
        status: '400',
        error: 'Incorrect Password',
      });
    } catch (err) {
      return res.status(500).json({
        status: 500,
        error: 'Server Error',
      });
    }
  }
}

export default userController;
