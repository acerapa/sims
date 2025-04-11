const Router = require("express").Router();
const {
  all,
  byId,
  destory,
  receiveOrder,
  update,
  register,
} = require("../controllers/PurchaseOrderController");
const { validateBody } = require("../middleware/request-validator");
const {
  PurchaseOrderCreationSchema,
  PurchaseOrderUpdateSchema,
  ReceivePurchaseOrderSchema,
} = require("shared");

Router.get("/all", all);
Router.get("/:id", byId);
Router.delete("/delete", destory);
Router.put("/:id", validateBody(PurchaseOrderUpdateSchema), update);
Router.post("/register", validateBody(PurchaseOrderCreationSchema), register);
Router.put(
  "/:id/receive-order",
  validateBody(ReceivePurchaseOrderSchema),
  receiveOrder
);

module.exports = Router;
