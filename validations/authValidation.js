// const Joi = require("joi");

// exports.registerValidation = (data) => {
//   const schema = Joi.object({
//     name: Joi.string().min(3).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
//     role: Joi.string().valid("user", "admin"),
//   });
//   return schema.validate(data);
// };

// exports.loginValidation = (data) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//   });
//   return schema.validate(data);
// };



const Joi = require("joi");

exports.registerValidation = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").optional(),
});

exports.loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

