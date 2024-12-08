const router = require("express").Router();

const {
  all,
  register,
  update,
  destroy,
} = require("../controllers/BranchController");
const { BranchCreateSchema, BranchUpdateSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

router.get("/all", all);
router.post("/register", validateBody(BranchCreateSchema), register);
router.post("/update/:id", validateBody(BranchUpdateSchema), update);
router.delete("/delete/:id", destroy);

module.exports = router;
