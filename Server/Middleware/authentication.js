import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class authenticator {
  static authenticateUser(req, res, next) {
    const codedToken = req.headers.authorization;
    if (!codedToken) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
      });
    }
    const token = codedToken.split(' ')[1];
    jwt.verify(token, process.env.token, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized user',
        });
      }
      return decoded;
    });
    return next();
  }
}

export default authenticator;
