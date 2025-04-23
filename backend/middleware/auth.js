const { validateAuthToken } = require("../services/AuthService");

async function validateUserAuth(req, res, next) {
  // get token from cookies
  try {
    validateAuthToken(req, res);
  } catch (error) {
    return res.sendError({ error: error.stack }, "Unauthorized", 401);
  }

  next();
}

module.exports = {
  validateUserAuth,
};
