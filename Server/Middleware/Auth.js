import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Authenticate {
  static authen(req, res, next) {
    const codedToken = req.headers.authorization;
    const token = codedToken.split(' ')[1];
    const verify = jwt.verify(token, process.env.token, err => err);
    if (verify) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized user',
      });
    }
    return next();
  }
}

export default Authenticate;
