const { response } = require("express");
const {
  responseError500,
  responseErrorCode,
  responseSuccessfully,
} = require("../helpers/handleResponse");
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const generateJwt = require("../helpers/generateJwt");
const { emailRegister } = require("../email/emailRegister");

const sgMail = require("@sendgrid/mail");
const cryptoRandomString = require("crypto-random-string");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const emailInfo = process.env.EMAIL_INFO;
const emailSoporte = process.env.EMAIL_SOPORTE;
const urlFrontend = process.env.urlFrontend;
const senderName = process.env.senderName;
const senderAddress = process.env.senderAddress;
const senderCity = process.env.senderCity;
const senderState = process.env.senderState;
const senderZip = process.env.senderZip;
const linkUnsubscribe = process.env.linkUnsubscribe;
const linkUnsubscribePreferences = process.env.linkUnsubscribePreferences;

const authCtrl = {};

authCtrl.createUser = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      return responseErrorCode(res, "Usuario no disponible", 400);
    }

    let tokenConfirm = "";
    tokenConfirm = await cryptoRandomString({
      length: 30,
      type: "url-safe",
    });

    const msg = {
      to: email,
      from: emailInfo,
      subject: "Registro exitoso !!",
      html: emailRegister(
        name,
        urlFrontend,
        email,
        tokenConfirm,
        emailSoporte,
        senderName,
        senderAddress,
        senderCity,
        senderState,
        senderZip,
        linkUnsubscribe,
        linkUnsubscribePreferences
      ),
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      return responseError500(res, error);
    }

    user = req.body;
    user.password = bcrypt.hashSync(password, 10);
    user.tokenConfirm = tokenConfirm;

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

authCtrl.login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return responseErrorCode(res, "Correo o contraseña incorrecta", 404);
    }

    if (!user.isEmailConfirmed) {
      return responseErrorCode(
        res,
        "Necesitas confirmar tu correo antes de iniciar sesión",
        404
      );
    }

    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return responseErrorCode(res, "Correo o contraseña incorrecta", 404);
    }

    const token = generateJwt(user.id, user.name);

    responseSuccessfully(res, "Login correcto", 200, {
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

authCtrl.confirmEmailToken = async (req, res = response) => {
  const { email, tokenConfirm } = req.query;
  console.log(email, tokenConfirm);

  try {
    let user = await User.findOne({ where: { email, tokenConfirm } });

    if (!user) {
      return responseErrorCode(res, "Correo o token incorrecto", 404);
    }

    user.tokenConfirm = null;
    user.isEmailConfirmed = true;
    await user.save();

    responseSuccessfully(res, "Correo confirmado", 200, {});
  } catch (error) {
    responseError500(res, error);
  }
};

authCtrl.renewToken = (req, res) => {
  const { uid, name } = req;
  try {
    const token = generateJwt(uid, name);

    responseSuccessfully(res, "Token renovado", 200, {
      uid,
      name,
      token,
    });
  } catch (error) {
    responseError500(res, error);
  }
};

module.exports = authCtrl;
