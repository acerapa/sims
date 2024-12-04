const router = require("express").Router();
const {
  all,
  destroy,
  register,
  update,
  getUserById,
} = require("../controllers/UserController");
const { UserSchema, UserUpdateSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

router.get("/all", all);
router.get("/:id", getUserById);
router.delete("/delete/:id", destroy);
router.post("/register", validateBody(UserSchema), register);
router.post("/:id/update", validateBody(UserUpdateSchema), update);

module.exports = router;
