const { response } = require("express");
const {
  responseError500,
  responseErrorCode,
} = require("../helpers/handleResponse");

const schemaValidate =
  (schema) =>
  (req, res = response, next) => {
    try {
      const { error } = schema.validate(
        {
          params: req.params,
          query: req.query,
          body: req.body,
        }
        // Se puede agregar { abortEarly: false } para que muestre todos los errores
        // { abortEarly: false }
      );

      if (error) {
        return responseErrorCode(res, error?.details[0]?.message, 400);
      }

      next();
    } catch (error) {
      responseError500(res, error);
    }
  };

module.exports = schemaValidate;
