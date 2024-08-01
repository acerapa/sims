const User = require("../models/user");
const bcryptJS = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Validation Schema
const { AuthSchema, VerifyTokenSchema } = require("shared");

module.exports = {
  login: async (req, res) => {
    const { value, error } = AuthSchema.validate(req.body);
    if (!error) {
      const user = await User.findOne({ where: { username: value.username } });
      if (user) {
        if (await bcryptJS.compare(value.password, user.password)) {
          // generate access token and refresh token
          const accessToken = jwt.sign(
            { user_id: user.id, refresh: false },
            process.env.SECRET_KEY,
            { expiresIn: process.env.TOKEN_EXP }
          );
          const refressToken = jwt.sign(
            { user_id: user.id, refresh: true },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: process.env.REFRESH_TOKEN_EXP }
          );

          res.sendResponse(
            {
              access: accessToken,
              refresh: refressToken,
            },
            "Successfully login!",
            200
          );
        }
      }
    } else {
      res.sendError(error, "Incorrect Credentials!", 401);
    }
  },

  verify: async (req, res) => {
    const { value, error } = VerifyTokenSchema.validate(req.body);
    let data;

    if (!error) {
      try {
        data = jwt.verify(value.token, process.env.SECRET_KEY);
        res.sendResponse({ isValid: true }, "Token is valid", 200);
      } catch (e) {
        res.sendError(
          { isValid: false },
          "Invalid access token! => " + e.message,
          401
        );
      }
    } else {
      res.sendError({ isValid: false, ...error }, "Invalid access token!", 401);
    }
  },

  refresh: async (req, res) => {
    try {
      const data = jwt.verify(req.body.refresh, process.env.REFRESH_TOKEN_KEY);

      if (data && data.refresh) {
        // generate new access and refresh token
        const accessToken = jwt.sign(
          { user_id: data.user_id, refresh: false },
          process.env.SECRET_KEY,
          { expiresIn: process.env.TOKEN_EXP }
        );
        const refressToken = jwt.sign(
          { user_id: data.user_id, refresh: true },
          process.env.REFRESH_TOKEN_KEY,
          { expiresIn: process.env.REFRESH_TOKEN_EXP }
        );

        res.sendResponse(
          { access: accessToken, refresh: refressToken },
          "Successfully refresh tokens",
          200
        );
      }
    } catch (e) {
      res.sendError(e, "Invalid refresh token =>" + e.message, 401);
    }
  },
};
