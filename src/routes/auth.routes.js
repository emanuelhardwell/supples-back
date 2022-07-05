const { Router } = require("express");
const {
  createUser,
  loginUser,
  renewToken,
  confirmEmailUser,
  resetPassword,
  updatePassword,
} = require("../controllers/auth.controllers");
const schemaValidate = require("../middlewares/schemaValidate.middlewares");
const { validateJwt } = require("../middlewares/validateJwt.middleware");
const {
  createUserSchema,
  loginUserSchema,
  confirmEmailUserSchema,
  resetPasswordUserSchema,
  updatePasswordUserSchema,
} = require("../schemas/auth.schema");

const routerAuth = Router();

routerAuth.post("/create", schemaValidate(createUserSchema), createUser);

routerAuth.post("/login", schemaValidate(loginUserSchema), loginUser);

routerAuth.get(
  "/confirm",
  schemaValidate(confirmEmailUserSchema),
  confirmEmailUser
);

routerAuth.post(
  "/reset-password",
  schemaValidate(resetPasswordUserSchema),
  resetPassword
);

routerAuth.post(
  "/update-password",
  schemaValidate(updatePasswordUserSchema),
  updatePassword
);

routerAuth.get("/renew", validateJwt, renewToken);

module.exports = routerAuth;
