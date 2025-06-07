const { PhysicalInventoryAdjustmentSchemaWithItems } = require("shared");
const { register, all, getOne } = require("../controllers/PhysicalInventoryAdjustmentController");
const { validateBody } = require("../middleware/request-validator");


const router = require("express").Router();

router.get('/', all)
router.get('/:id', getOne)

router.post('/', validateBody(PhysicalInventoryAdjustmentSchemaWithItems), register)

module.exports = router;
