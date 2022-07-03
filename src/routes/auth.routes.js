const { Router } = require("express");
const { createUser } = require("../controllers/auth.controllers");

const routerAuth = Router();

routerAuth.post("/create", createUser);

module.exports = routerAuth;
