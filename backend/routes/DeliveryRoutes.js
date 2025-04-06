const router = require("express").Router();
const { all } = require("../controllers/DeliveryController");

router.get("/", all);

module.exports = router;
