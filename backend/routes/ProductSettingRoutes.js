const { Router } = require("express");
const router = Router();
const {
  all,
  register,
  update,
  destroy,
} = require("../controllers/SettingController");

router.get("/all", all);
router.post("/update", update);
router.post("/register", register);
router.delete("/delete/:id", destroy);

module.exports = router;
