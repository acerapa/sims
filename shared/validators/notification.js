const joi = require("joi");
const { NotificationStatus } = require("../enums");

const NotificationSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  status: joi
    .string()
    .valid(...Object.values(NotificationStatus))
    .required(),

  route: joi.string().allow(null, "").optional(),
});

module.exports = { NotificationSchema };
