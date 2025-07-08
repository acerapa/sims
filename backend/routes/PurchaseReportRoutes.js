const { purchaseByVendor } = require("../controllers/PurchaseController");

const router = require("express").Router();

router.get("/purchase-by-vendor", purchaseByVendor);

module.exports = router;
