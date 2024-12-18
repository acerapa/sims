const { all, register } = require("../controllers/SalesOrderController");

const router = require("express").Router();

router.get("/all", all);
router.post("/register", register);

module.exports = router;
