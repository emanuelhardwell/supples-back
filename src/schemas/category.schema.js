const Joi = require("joi");

const categorySchema = {};

categorySchema.createCategorySchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    name: Joi.string().min(3).max(25).required().messages({
      "string.base": `Nombre debe ser un texto`,
      "string.empty": `Nombre no puede venir vacio`,
      "string.min": `Nombre debe tener minimo 3 letras`,
      "string.max": `Nombre debe tener maximo 25 letras`,
      "any.required": `Nombre es obligatorio`,
    }),
  }),
  files: Joi.object({}),
});

categorySchema.updateCategorySchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().messages({
      "number.base": `Id debe ser un número`,
      "number.empty": `Id no puede venir vacio`,
      "any.required": `Id es obligatorio`,
    }),
  }),
  query: Joi.object({}),
  body: Joi.object({
    name: Joi.string().min(3).max(25).required().messages({
      "string.base": `Nombre debe ser un texto`,
      "string.empty": `Nombre no puede venir vacio`,
      "string.min": `Nombre debe tener minimo 3 letras`,
      "string.max": `Nombre debe tener maximo 25 letras`,
      "any.required": `Nombre es obligatorio`,
    }),
  }),
  files: Joi.object({}),
});

categorySchema.deleteCategorySchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().messages({
      "number.base": `Id debe ser un número`,
      "number.empty": `Id no puede venir vacio`,
      "any.required": `Id es obligatorio`,
    }),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
  files: Joi.object({}),
});

module.exports = categorySchema;
