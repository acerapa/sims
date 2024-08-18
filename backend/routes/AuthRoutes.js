const router = require("express").Router();
const { AuthSchema } = require("shared/validators/auth");
const AuthController = require("../controllers/AuthController");
const { validateBody } = require("../middleware/request-validator");

router.post("/login", validateBody(AuthSchema), AuthController.login);
router.post("/token/verify", AuthController.verify);
router.post("/token/refresh", AuthController.refresh);

module.exports = router;
