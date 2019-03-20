import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class authenticator {
  static authenticateUser(req, res, next) {
    const token = req.headers.authtoken;
    if (!token) {
      return res.status(400).json({
        status: 400,
        error: 'Bad Request',
      });
    }
    const verify = jwt.verify(token, process.env.token, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized user',
        });
      }
      return decoded;
    });
    req.decoder = verify.id;
    return next();
  }
}

export default authenticator;
