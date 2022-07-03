const { response } = require("express");
const {
  responseError500,
  responseErrorCode,
  responseSuccessfully,
} = require("../helpers/handleResponse");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const generateJwt = require("../helpers/generateJwt");

const authCtrl = {};

authCtrl.createUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      return responseErrorCode(res, "Usuario no disponible", 400);
    }

    user = req.body;
    user.password = bcrypt.hashSync(password, 10);

    const userSaved = await User.create(user);
    const token = generateJwt(userSaved.id, userSaved.name);

    responseSuccessfully(res, "Usuario creado", 201, {
      uid: userSaved.id,
      name: userSaved.name,
      token,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

module.exports = authCtrl;
