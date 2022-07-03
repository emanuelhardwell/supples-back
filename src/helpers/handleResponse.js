const responseError500 = (res, error) => {
  console.log("Error: ", error);
  return res.status(500).json({
    ok: false,
    message: "Contacte al administrador",
  });
};

const responseErrorCode = (res, message = "Error", code = 401) => {
  return res.status(code).json({
    ok: false,
    message,
  });
};

const responseSuccessfully = (res, message = "ok", code = 200, data) => {
  return res.status(code).json({
    ok: true,
    message,
    ...data,
  });
};

module.exports = { responseError500, responseErrorCode, responseSuccessfully };
