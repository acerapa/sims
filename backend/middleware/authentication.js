const jwt = require("jsonwebtoken");
const validateToken = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken)
    res.sendError({ error: "Unauthorized" }, "Unauthorized", 401);
  const token = bearerToken.split(" ")[1];

  if (jwt.verify(token, process.env.SECRET_KEY)) {
    req.user_id = jwt.decode(token).user_id;
    next();
  } else {
    console.log("token is invalid");
    res.sendError({ error: "Unauthorized" }, "Unauthorized", 401);
  }
};

module.exports = {
  validateToken,
};
