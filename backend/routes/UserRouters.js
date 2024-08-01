const router = require("express").Router();
const UserController = require("../controllers/UserController");
const { UserSchema, UserUpdateSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

router.get("/all", UserController.all);
router.delete("/delete", UserController.delete);
router.post("/register", validateBody(UserSchema), UserController.register);
router.post("/:id/update", validateBody(UserUpdateSchema), UserController.update);

module.exports = router;
