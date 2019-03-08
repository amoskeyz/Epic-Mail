import Joi from 'joi';

const schema = {
  Registerschema:
    Joi.object().keys({
      firstname: Joi.string().trim().min(2).required(),
      lastname: Joi.string().trim().min(2).required(),
      email: Joi.string().email().lowercase().required(),
      password: Joi.required(),
      phoneNumber: Joi.required(),
    }),

  Loginschema:
    Joi.object().keys({
      email: Joi.string().email().lowercase().required(),
      password: Joi.required(),
    }),
};

export default schema;
