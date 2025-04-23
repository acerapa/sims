const router = require("express").Router();

const {
  all,
  register,
  update,
  destroy,
  getCurrentBranch,
} = require("../controllers/BranchController");
const { BranchCreateSchema, BranchUpdateSchema } = require("shared");
const { validateBody } = require("../middleware/request-validator");

router.get("/all", all);
router.get("/current", getCurrentBranch);
router.post("/register", validateBody(BranchCreateSchema), register);
router.post("/update/:id", validateBody(BranchUpdateSchema), update);
router.delete("/delete/:id", destroy);

module.exports = router;
