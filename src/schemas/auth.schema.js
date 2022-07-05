const Joi = require("joi");

const authSchema = {};

authSchema.createUserSchema = Joi.object({
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
    lastname: Joi.string().min(3).max(25).required().messages({
      "string.base": `Apellido materno debe ser un texto`,
      "string.empty": `Apellido materno no puede venir vacio`,
      "string.min": `Apellido materno debe tener minimo 3 letras`,
      "string.max": `Apellido materno debe tener maximo 25 letras`,
      "any.required": `Apellido materno es obligatorio`,
    }),
    lastname2: Joi.string().optional().allow(null).allow(""),
    email: Joi.string().email().required().messages({
      "string.base": `Correo debe ser un texto`,
      "string.empty": `Correo no puede venir vacio`,
      "string.email": `Correo no valido`,
      "any.required": `Correo es obligatorio`,
    }),
    password: Joi.string().min(6).max(25).required().messages({
      "string.base": `Contraseña debe ser un texto`,
      "string.empty": `Contraseña no puede venir vacio`,
      "string.min": `Contraseña debe tener minimo 6 letras`,
      "string.max": `Contraseña debe tener maximo 25 letras`,
      "any.required": `Contraseña es obligatorio`,
    }),
  }),
});

authSchema.loginUserSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": `Correo debe ser un texto`,
      "string.empty": `Correo no puede venir vacio`,
      "string.email": `Correo no valido`,
      "any.required": `Correo es obligatorio`,
    }),
    password: Joi.string().min(6).max(25).required().messages({
      "string.base": `Contraseña debe ser un texto`,
      "string.empty": `Contraseña no puede venir vacio`,
      "string.min": `Contraseña debe tener minimo 6 letras`,
      "string.max": `Contraseña debe tener maximo 25 letras`,
      "any.required": `Contraseña es obligatorio`,
    }),
  }),
});

authSchema.confirmEmailUserSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": `Correo debe ser un texto`,
      "string.empty": `Correo no puede venir vacio`,
      "string.email": `Correo no valido`,
      "any.required": `Correo es obligatorio`,
    }),
    token: Joi.string().min(30).max(32).required().messages({
      "string.base": `Token debe ser un texto`,
      "string.empty": `Token no puede venir vacio`,
      "string.min": `Token debe tener minimo 30 letras`,
      "string.max": `Token debe tener maximo 32 letras`,
      "any.required": `Token es obligatorio`,
    }),
  }),
  body: Joi.object({}),
});

authSchema.resetPasswordUserSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": `Correo debe ser un texto`,
      "string.empty": `Correo no puede venir vacio`,
      "string.email": `Correo no valido`,
      "any.required": `Correo es obligatorio`,
    }),
  }),
});

authSchema.updatePasswordUserSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    password: Joi.string().min(6).max(25).required().messages({
      "string.base": `Contraseña debe ser un texto`,
      "string.empty": `Contraseña no puede venir vacio`,
      "string.min": `Contraseña debe tener minimo 6 letras`,
      "string.max": `Contraseña debe tener maximo 25 letras`,
      "any.required": `Contraseña es obligatorio`,
    }),
    token: Joi.string().min(10).max(20).required().messages({
      "string.base": `Token debe ser un texto`,
      "string.empty": `Token no puede venir vacio`,
      "string.min": `Token debe tener minimo 10 letras`,
      "string.max": `Token debe tener maximo 20 letras`,
      "any.required": `Token es obligatorio`,
    }),
  }),
});

module.exports = authSchema;
