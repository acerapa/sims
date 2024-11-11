const router = require("express").Router();
const AccountController = require("../controllers/AccountController");

router.get("/all", AccountController.all);
router.post("/update", AccountController.update);
router.delete("/delete/:id", AccountController.delete);
router.post("/register", AccountController.register);

module.exports = router;
