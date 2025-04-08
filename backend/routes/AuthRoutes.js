const router = require("express").Router();
const { AuthSchema } = require("shared");
const AuthController = require("../controllers/AuthController");
const { validateBody } = require("../middleware/request-validator");
const { validateUserAuth } = require("../middleware/auth");

router.get("/me", validateUserAuth, AuthController.authUser);
router.post("/logout", validateUserAuth, AuthController.logout);
router.post("/login", validateBody(AuthSchema), AuthController.login);
router.post("/token/verify", AuthController.verify);
router.post("/token/refresh", AuthController.refresh);

module.exports = router;
