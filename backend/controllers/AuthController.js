const User = require("../models/user");
const bcryptJS = require("bcryptjs");
const jwt = require("jsonwebtoken");
const BranchMember = require("../models/branch-member");
const Branch = require("../models/branch");

// Validation Schema
const { VerifyTokenSchema } = require("shared");
const {
  authenticateUser,
  generateToken,
  setTokenToCookies,
  decodeToken,
  clearTokens,
} = require("../services/AuthService");

module.exports = {
  login: async (req, res) => {
    try {
      // authentication
      const { username, password } = req.body.validated;
      const payload = await authenticateUser(username, password);

      // generate tokens
      const accessToken = generateToken(payload);
      const refreshToken = generateToken(payload, true);

      // set tokens to cookies
      setTokenToCookies(res, accessToken);
      setTokenToCookies(res, refreshToken, true);

      res.sendResponse({}, "Successfully logged in", 200);
    } catch (e) {
      res.sendError({ ...e }, e.message, 401);
    }
  },

  authUser: async (req, res) => {
    try {
      const allowedFields = Object.keys(User.getAttributes()).filter(
        (key) => key !== "password"
      );

      const user = await User.findByPk(res.user_id, {
        attributes: allowedFields,
      });

      res.sendResponse({ user }, "Successfully fetched auth user", 200);
    } catch (e) {
      res.sendError({ ...e }, e.message, 401);
    }
  },

  logout: (req, res) => {
    res.user_id = null;
    clearTokens(res);
    res.sendResponse({}, "Successfully logged out", 200);
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

      const user = await User.findOne({
        where: {
          id: data.user_id,
        },
      });

      if (!user) {
        throw new Error("User in token is not valid!");
      }

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
          { access: accessToken, refresh: refressToken, user: user },
          "Successfully refresh tokens",
          200
        );
      } else {
        throw new Error("Invalid token data");
      }
    } catch (e) {
      res.sendError(e, "Invalid refresh token =>" + e.message, 401);
    }
  },
};
