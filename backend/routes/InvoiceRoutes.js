const { all } = require("../controllers/InvoiceController");

const router = require("express").Router();

router.get("/", all);

module.exports = router;
