const jwt = require("jsonwebtoken");
const validateToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (jwt.verify(token, process.env.SECRET_KEY)) {
    console.log("token is valid");
    next();
  } else {
    console.log("token is invalid");
    res.sendError({ error: "Unauthorized" }, "Unauthorized", 401);
  }
};

module.exports = {
  validateToken,
};
