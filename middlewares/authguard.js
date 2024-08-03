const jwt = require("jsonwebtoken");
const SECRETS = require("../common/secrets");

const authGuard = async (req, res, next) => {
  const token =
    req.headers?.authorization || req.query?.token || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const secretValue = await SECRETS.getSecrets();

  try {
    const decoded = jwt.verify(token, secretValue.jwtsecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid Token." });
  }
};

module.exports = authGuard;
