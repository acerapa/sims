const Joi = require("joi");

class ValidatorHelpers {
  static makeSchemaFieldOptional = (schema) => {
    if (schema.type == "object") {
      const newSchema = {};
      schema.$_terms.keys.forEach((key) => {
        newSchema[key.key] = key.schema.allow(null, "").optional();
      });
      return Joi.object(newSchema);
    } else {
      return schema.optional();
    }
  };
}

module.exports = { ValidatorHelpers };
