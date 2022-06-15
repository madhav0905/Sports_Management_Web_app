const Joi = require("joi");

module.exports = function (ms) {
  const schema = Joi.object({
    username: Joi.string().min(5).required().email(),
    password: Joi.string().min(5).required(),
    first_name: Joi.string().min(3).required(),
    address: Joi.string().required().min(5),
    age: Joi.number().integer().required().positive(),
    bloodgroup: Joi.string().required().min(1).max(3),
  });
  return schema.validate(ms);
};
