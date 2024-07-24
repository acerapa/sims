const { Router } = require("express");
const router = Router();
const { all, register, update, destroy } = require("../controllers/ProductSettingController");

router.get("/all", all);
router.post("/update", update);
router.post("/register", register);
router.delete("/delete", destroy);

module.exports = router;
