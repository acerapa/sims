const { PhysicalInventoryAdjustmentSchemaWithItems } = require("shared");
const { register } = require("../controllers/PhysicalInventoryAdjustmentController");
const { validateBody } = require("../middleware/request-validator");


const router = require("express").Router();

router.post('/', validateBody(PhysicalInventoryAdjustmentSchemaWithItems), register)

module.exports = router;
