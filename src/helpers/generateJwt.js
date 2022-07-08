const jwt = require("jsonwebtoken");

const generateJwt = (uid, name, rol, cart) => {
  const token = jwt.sign({ uid, name, rol, cart }, process.env.SECRET_JWT, {
    expiresIn: "10h",
  });

  return token;
};

module.exports = generateJwt;
