const jwt = require("jsonwebtoken");

const generateJwt = (uid, name) => {
  const token = jwt.sign({ uid, name }, process.env.SECRET_JWT, {
    expiresIn: "10h",
  });

  return token;
};

module.exports = generateJwt;
