const router = require("express").Router();
const {
  get,
  create,
  updateStatusDelivery,
  updateStatusAdmin,
} = require("./orders.service");
const { isLogged, hasRole } = require("../middlewares");

router.get("/", isLogged, get);
router.post("/add", isLogged, create);
router.put(
  "/update-delivery-status/:orderId",
  isLogged,
  hasRole("DELIVERY_PERSON"),
  updateStatusDelivery
);
router.put(
  "/update-status/:orderId",
  isLogged,
  hasRole("ADMIN"),
  updateStatusAdmin
);

module.exports = router;
