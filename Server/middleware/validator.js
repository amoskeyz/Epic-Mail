import joi from 'joi';
import schema from '../helper/schemas';

class validate {
  static validateSignup(req, res, next) {
    const {
      firstname, lastname, email, password, phonenumber,
    } = req.body;

    const user = {
      firstname, lastname, email, password, phonenumber,
    };

    joi.validate(user, schema.Registerschema, (err) => {
      if (err) {
        const error = err.details[0].message;
        return res.status(400).json({
          status: 400,
          error: error.replace(/"/gi, ''),
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
          error: err.details[0].message,
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
          error: err.details[0].message,
        });
      }
      return next();
    });
  }

  static validateMessage(req, res, next) {
    const {
      subject, message, email,
    } = req.body;
    const newMessage = {
      subject, message, email,
    };

    joi.validate(newMessage, schema.Messageschema, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: err.details[0].message,
        });
      }
      return next();
    });
  }

  static validateGroup(req, res, next) {
    const {
      name,
    } = req.body;

    const group = {
      name,
    };

    joi.validate(group, schema.groupSchema, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: err.details[0].message,
        });
      }
      return next();
    });
  }

  static validateUser(req, res, next) {
    const { email } = req.body;

    const user = { email };

    joi.validate(user, schema.uSchema, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          error: err.details[0].message,
        });
      }
      return next();
    });
  }
}

export default validate;
