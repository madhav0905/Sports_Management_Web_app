const Joi = require("joi");

module.exports = function (schema,ms) {

  return schema.validate(ms);
};
