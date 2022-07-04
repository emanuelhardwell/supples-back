const { Router } = require("express");
const { check, body, param, query } = require("express-validator");
const {
  createUser,
  login,
  renewToken,
  confirmEmailToken,
} = require("../controllers/auth.controllers");
const { validateInputs } = require("../middlewares/inputValidate.middleware");
const { validateJwt } = require("../middlewares/validateJwt.middleware");

const routerAuth = Router();

routerAuth.post(
  "/create",
  [
    body("name", "El nombre es requerido").notEmpty(),
    body("lastname", "El apellido paterno es requerido").notEmpty(),
    body("lastname2", "El apellido materno es requerido").optional(),
    body("email", "El correo es requerido").isEmail(),
    body(
      "password",
      "La contraseña es requerida y debe ser mayor a 5 caracteres"
    ).isLength({ min: 6 }),
    validateInputs,
  ],
  createUser
);

routerAuth.post(
  "/login",
  [
    body("email", "El correo es requerido").isEmail(),
    body(
      "password",
      "La contraseña es requerida y debe ser mayor a 5 caracteres"
    ).isLength({ min: 6 }),
    validateInputs,
  ],
  login
);

routerAuth.get(
  "/confirm",
  [
    query("email", "El correo es requerido").isEmail(),
    query("tokenConfirm", "El token es requerido").isLength({ min: 30 }),
    validateInputs,
  ],
  confirmEmailToken
);

routerAuth.get("/renew", validateJwt, renewToken);

module.exports = routerAuth;
