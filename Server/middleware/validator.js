import joi from 'joi';
import schema from '../helper/schemas';

class validate {
  static validateSignup(req, res, next) {
    const {
      firstName, lastName, email, password, phoneNumber,
    } = req.body;

    const user = {
      firstName, lastName, email, password, phoneNumber,
    };

    joi.validate(user, schema.Registerschema, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: 'one more entry required',
        });
      }
      return next();
    });
  }

  static validateSignin(req, res, next) {
    const {
      email, password,
    } = req.body;

    const user = {
      email, password,
    };

    joi.validate(user, schema.Loginschema, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: err,
        });
      }
      return next();
    });
  }

  static validateid(req, res, next) {
    joi.validate({ id: req.params.id }, schema.idschema, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: err,
        });
      }
      return next();
    });
  }

  static validateMessage(req, res, next) {
    const {
      subject, message, parentMessageId, status, senderId, receiverId,
    } = req.body;

    const newMessage = {
      subject, message, parentMessageId, status, senderId, receiverId,
    };

    joi.validate(newMessage, schema.Messageschema, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: err,
        });
      }
      return next();
    });
  }
}

export default validate;
