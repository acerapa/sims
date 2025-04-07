const { UserStatus } = require("shared/enums");
const User = require("../models/user");
const bcryptJS = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Authenticates a user by username and password.
 *
 * @param {string} username - The username of the user to authenticate
 * @param {string} password - The password to verify
 * @returns {Object} An object containing the user's ID and position
 * @throws {Error} Throws an error if the username is invalid or the password is incorrect
 */
async function authenticateUser(username, password) {
  const user = await User.findOne({
    where: {
      username: username,
      status: UserStatus.ACTIVE,
    },
    attributes: ["id", "password", "position"],
  });

  if (!user) throw new Error("Invalid username or password");

  if (!(await bcryptJS.compare(password, user.password)))
    throw new Error("Invalid username or password");

  return {
    user_id: user.id,
    position: user.position,
    refresh: false,
  };
}

/**
 * Generates a JWT token with optional refresh token configuration.
 *
 * @param {Object} payload - The data to be encoded in the token
 * @param {boolean} [isRefresh=false] - Flag to indicate if this is a refresh token
 * @returns {string} A signed JWT token
 */
function generateToken(payload, isRefresh = false) {
  payload.refresh = isRefresh;

  const secretKey = isRefresh
    ? process.env.REFRESH_TOKEN_KEY
    : process.env.SECRET_KEY;
  const expiresIn = isRefresh
    ? process.env.REFRESH_TOKEN_EXP
    : process.env.TOKEN_EXP;

  return jwt.sign(payload, secretKey, { expiresIn });
}

/**
 * Sets a token in HTTP-only cookies with configurable settings based on token type.
 *
 * @param {Object} res - The HTTP response object
 * @param {string} token - The JWT token to be set in the cookie
 * @param {boolean} [isRefresh=false] - Flag to determine if the token is a refresh token
 */
function setTokenToCookies(res, token, isRefresh = false) {
  const name = isRefresh ? "refresh_token" : "access_token";

  // refresh token is 7 days to expire
  // while access token is 15 minutes
  const maxAge = isRefresh ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 15;

  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none", // will be converted to 'strict' in production
    maxAge: maxAge,
  });
}

/**
 * Decodes a JWT token and returns its payload.
 *
 * @param {string} token - The JWT token to decode
 * @returns {Object|null} The decoded token payload, or null if decoding fails
 */
function decodeToken(token) {
  return jwt.decode(token, { json: true });
}

/**
 * Verifies the authenticity of a JWT token using the appropriate secret key.
 *
 * @param {string} token - The JWT token to verify
 * @param {boolean} [isRefresh=false] - Flag to indicate if this is a refresh token
 * @returns {Object} The verified token payload
 * @throws {JsonWebTokenError} If the token is invalid or has expired
 */
function verifyToken(token, isRefresh = false) {
  if (!token) return false;

  const secretKey = isRefresh
    ? process.env.REFRESH_TOKEN_KEY
    : process.env.SECRET_KEY;

  try {
    jwt.verify(token, secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validates and refreshes authentication tokens from request cookies.
 *
 * @param {Object} req - The HTTP request object containing authentication cookies
 * @param {Object} res - The HTTP response object for setting new tokens
 * @throws {Error} Throws "Unauthorized" error if no valid tokens are found
 */
function validateAuthToken(req, res) {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  const isAccessValid = verifyToken(accessToken);
  if (!isAccessValid) {
    const isRefreshValid = verifyToken(refreshToken, true);
    if (!isRefreshValid) {
      throw new Error("Unauthorized");
    } else {
      const decoded = decodeToken(refreshToken);
      const payload = {
        user_id: decoded.user_id,
        position: decoded.position,
      };

      const newAccessToken = generateToken(payload);
      const newRefreshToken = generateToken(payload, true);

      setTokenToCookies(res, newAccessToken);
      setTokenToCookies(res, newRefreshToken, true);
    }
  }
}

/**
 * Clears authentication tokens from the response cookies.
 *
 * @param {Object} res - The HTTP response object to clear cookies from
 */
function clearTokens(res) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none", // will be converted to 'strict' in production
    maxAge: 1000 * 60 * 15,
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none", // will be converted to 'strict' in production
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

module.exports = {
  clearTokens,
  decodeToken,
  verifyToken,
  generateToken,
  authenticateUser,
  setTokenToCookies,
  validateAuthToken,
};
