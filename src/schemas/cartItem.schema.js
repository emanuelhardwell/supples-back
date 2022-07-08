const Joi = require("joi");

const cartItemSchema = {};

cartItemSchema.createCartItemSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    productId: Joi.number().min(1).required().messages({
      "number.base": `productId debe ser un número`,
      "number.empty": `productId no puede venir vacio`,
      "number.min": `productId debe tener minimo 1`,
      "any.required": `productId es obligatorio`,
    }),
    quantity: Joi.number().min(1).max(15).required().messages({
      "number.base": `Cantidad debe ser un número`,
      "number.empty": `Cantidad no puede venir vacio`,
      "number.min": `Cantidad debe tener minimo 1`,
      "number.max": `Cantidad debe tener maximo 15`,
      "any.required": `Cantidad es obligatorio`,
    }),
  }),
  files: Joi.object({}),
});

cartItemSchema.updateCartItemSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().messages({
      "number.base": `Id debe ser un número`,
      "number.empty": `Id no puede venir vacio`,
      "any.required": `Id es obligatorio`,
    }),
  }),
  query: Joi.object({}),
  body: Joi.object({
    productId: Joi.number().min(1).required().messages({
      "number.base": `productId debe ser un número`,
      "number.empty": `productId no puede venir vacio`,
      "number.min": `productId debe tener minimo 1`,
      "any.required": `productId es obligatorio`,
    }),
    quantity: Joi.number().min(1).max(15).required().messages({
      "number.base": `Cantidad debe ser un número`,
      "number.empty": `Cantidad no puede venir vacio`,
      "number.min": `Cantidad debe tener minimo 1`,
      "number.max": `Cantidad debe tener maximo 15`,
      "any.required": `Cantidad es obligatorio`,
    }),
  }),
  files: Joi.object({}),
});

cartItemSchema.deleteCartItemSchema = Joi.object({
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

module.exports = cartItemSchema;
