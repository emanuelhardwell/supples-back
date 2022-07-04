const { request } = require("express");
const jwt = require("jsonwebtoken");
const { responseErrorCode } = require("../helpers/handleResponse");

const validateJwt = (req = request, res, next) => {
  const token = req.header("token");

  if (!token) {
    return responseErrorCode(res, "Usuario no autorizado", 401);
  }

  try {
    const jwtVerify = jwt.verify(token, process.env.SECRET_JWT);
    req.uid = jwtVerify.uid;
    req.name = jwtVerify.name;

    next();
  } catch (error) {
    return responseErrorCode(res, "Token invalido o expirado", 500);
  }
};

module.exports = { validateJwt };
