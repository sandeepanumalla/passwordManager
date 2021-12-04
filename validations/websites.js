const joi = require("@hapi/joi");

const readCardSchema = joi.object({
  user_id: joi.number().required(),
});

const createCardSchema = joi.object({
  user_id: joi.number().required(),
  website_name: joi.string().required(),
  url: joi.string().required().min(2),
});

const updateCardSchema = joi.object({
  user_id: joi.number().required(),
  website_id: joi.number().required(),
  value: joi.string().required(),
  column: joi.string().required(),
});

const deleteCardSchema = joi.object({
  user_id: joi.number().required(),
  website_id: joi.number().required(),
});

module.exports = {
  readCardSchema,
  updateCardSchema,
  deleteCardSchema,
  createCardSchema,
};
