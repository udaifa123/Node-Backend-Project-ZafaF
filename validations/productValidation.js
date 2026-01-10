const Joi = require("joi");

exports.productValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(), // ✅ ADDED
});
