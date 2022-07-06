const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
module.exports = function (schema, ms) {
  return schema.validate(ms);
};
