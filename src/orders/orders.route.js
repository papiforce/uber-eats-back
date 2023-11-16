const router = require("express").Router();
const {
  get,
  getlatest,
  create,
  cancel,
  updateStatusDelivery,
  updateStatusAdmin,
} = require("./orders.service");
const { isLogged, hasRole } = require("../middlewares");

router.get("/", isLogged, get);
router.get("/latest", isLogged, getlatest);
router.post("/add", isLogged, create);
router.put("/cancel/:orderId", isLogged, hasRole("MEMBER"), cancel);
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
