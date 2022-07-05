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
const { Op } = require("sequelize");
const sgMail = require("@sendgrid/mail");
const cryptoRandomString = require("crypto-random-string");
const { emailResetPassword } = require("../email/emailResetPassword");
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

authCtrl.loginUser = async (req, res = response) => {
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

authCtrl.confirmEmailUser = async (req, res = response) => {
  const { email, token } = req.query;

  try {
    let user = await User.findOne({ where: { email, tokenConfirm: token } });

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

authCtrl.resetPassword = async (req, res = response) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return responseSuccessfully(
        res,
        "1.- Revisa tu correo electrónico y sigue los pasos. Si no recibe un correo y no está en su carpeta de correo no deseado, esto podría significar que se registró con una dirección diferente",
        200,
        {}
      );
    }

    let tokenConfirm = "";
    tokenConfirm = await cryptoRandomString({
      length: 10,
      type: "url-safe",
    });

    user.resetToken = tokenConfirm;
    user.resetTokenExpiration = Date.now() + 450000;
    await user.save();

    const msg = {
      to: email,
      from: emailInfo,
      subject: "Restablecer la contraseña !!",
      html: emailResetPassword(
        user.name,
        tokenConfirm,
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

    responseSuccessfully(
      res,
      "Revisa tu correo electrónico y sigue los pasos. Si no recibe un correo y no está en su carpeta de correo no deseado, esto podría significar que se registró con una dirección diferente",
      200,
      {}
    );
  } catch (error) {
    responseError500(res, error);
  }
};

authCtrl.updatePassword = async (req, res = response) => {
  const { password, token } = req.body;

  try {
    let user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return responseErrorCode(res, "Token incorrecto o Token expirado", 400);
    }

    user.password = bcrypt.hashSync(password, 10);
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    responseSuccessfully(res, "Contraseña actualizada", 200, {});
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
