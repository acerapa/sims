const { all } = require("../controllers/ReceivePaymentsConstroller");

const router = require("express").Router();

router.get("/", all);

module.exports = router;
