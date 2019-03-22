import Joi from 'joi';

const schema = {
  Registerschema:
    Joi.object().keys({
      firstname: Joi.string().trim().min(2).required(),
      lastname: Joi.string().trim().min(2).required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.required(),
      phonenumber: Joi.required(),
    }),

  Loginschema:
    Joi.object().keys({
      email: Joi.string().email().lowercase().required(),
      password: Joi.required(),
    }),

  idschema:
    Joi.object().keys({
      id: Joi.number().integer().required(),
    }),

  Messageschema:
    Joi.object().keys({
      subject: Joi.string().required(),
      message: Joi.string().required(),
      email: Joi.string().email().lowercase().required(),
    }),

  // groupSchema:
  //   Joi.object().keys({
  //     name: Joi.string().trim().min(2).required(),
  //   }),
};

export default schema;
