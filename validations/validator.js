const joi = require("@hapi/joi");

const authSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required()
    .max(20),
  master_password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .max(20),
});

const masterPasswordSchema = joi.object({
  user_id: joi.number().required(),
  master_password: joi.string().min(8).max(20).required(),
});

const entrySchema = joi.object({
  user_id: joi.number().required(),
  url: joi.string().required(),
  web_username: joi.string().required(),
  web_password: joi.string().required(),
  favicon_url: joi.string(),
  isImportant: joi.boolean().default(false),
});

const updateEntriesSchema = joi.object({
  url: joi.string().required(),
  eid: joi.number().required(),
});

module.exports = {
  authSchema,
  entrySchema,
  masterPasswordSchema,
  updateEntriesSchema,
};
