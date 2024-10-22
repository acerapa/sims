const router = require("express").Router();
const { register, getAllByType } = require("../controllers/B2BController");
const { validateBody } = require("../middleware/request-validator");
const { BranchTransferCreateSchema } = require("shared/validators/transfer");

router.get("/all/:type", getAllByType);
router.post("/register", validateBody(BranchTransferCreateSchema), register);

module.exports = router;
