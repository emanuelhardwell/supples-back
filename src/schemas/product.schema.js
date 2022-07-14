const Joi = require("joi");

const productSchema = {};

productSchema.createProductSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": `Nombre debe ser un texto`,
      "string.empty": `Nombre no puede venir vacio`,
      "string.min": `Nombre debe tener minimo 3 letras`,
      "string.max": `Nombre debe tener maximo 100 letras`,
      "any.required": `Nombre es obligatorio`,
    }),
    description: Joi.string().min(3).max(250).required().messages({
      "string.base": `Description debe ser un texto`,
      "string.empty": `Description no puede venir vacio`,
      "string.min": `Description debe tener minimo 3 letras`,
      "string.max": `Description debe tener maximo 250 letras`,
      "any.required": `Description es obligatorio`,
    }),
    price: Joi.number().greater(1.12).precision(2).required().messages({
      "number.base": `Precio debe ser un número`,
      "number.empty": `Precio no puede venir vacio`,
      "number.greater": `Precio debe ser mayor a $1`,
      "any.required": `Precio es obligatorio`,
    }),
    categoryId: Joi.number().required().messages({
      "number.base": `Categoria debe ser un número`,
      "number.empty": `Categoria no puede venir vacio`,
      "any.required": `Categoria es obligatorio`,
    }),
  }),
  files: Joi.object({
    image: Joi.custom((file, helpers) => {
      if (file.size > 10000000) {
        return helpers.message(
          "La imagen supera los 10 mb, suba uma imagen más pequeña"
        );
      }

      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        return helpers.message(
          "Solo se permiten imagenes con extensión png/jpeg/jpg"
        );
      }
    }),
  }),
});

productSchema.updateProductSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().messages({
      "number.base": `Id debe ser un número`,
      "number.empty": `Id no puede venir vacio`,
      "any.required": `Id es obligatorio`,
    }),
  }),
  query: Joi.object({}),
  body: Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": `Nombre debe ser un texto`,
      "string.empty": `Nombre no puede venir vacio`,
      "string.min": `Nombre debe tener minimo 3 letras`,
      "string.max": `Nombre debe tener maximo 100 letras`,
      "any.required": `Nombre es obligatorio`,
    }),
    description: Joi.string().min(3).max(250).required().messages({
      "string.base": `Description debe ser un texto`,
      "string.empty": `Description no puede venir vacio`,
      "string.min": `Description debe tener minimo 3 letras`,
      "string.max": `Description debe tener maximo 250 letras`,
      "any.required": `Description es obligatorio`,
    }),
    price: Joi.number().positive().precision(2).greater(0).required().messages({
      "number.base": `Precio debe ser un número`,
      "number.empty": `Precio no puede venir vacio`,
      "number.positive": `Precio debe ser positivo`,
      "any.required": `Precio es obligatorio`,
    }),
    categoryId: Joi.number().required().messages({
      "number.base": `Categoria debe ser un número`,
      "number.empty": `Categoria no puede venir vacio`,
      "any.required": `Categoria es obligatorio`,
    }),
  }),
  files: Joi.object({
    image: Joi.custom((file, helpers) => {
      if (file.size > 10000000) {
        return helpers.message(
          "La imagen supera los 10 mb, suba uma imagen más pequeña"
        );
      }

      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        return helpers.message(
          "Solo se permiten imagenes con extensión png/jpeg/jpg"
        );
      }
    }),
  }),
});

productSchema.deleteProductSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().required().messages({
      "number.base": `Id debe ser un número`,
      "number.empty": `Id no puede venir vacio`,
      "any.required": `Id es obligatorio`,
    }),
  }),
  query: Joi.object({}),
  body: Joi.object({}),
});

module.exports = productSchema;
