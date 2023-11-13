const router = require("express").Router();
const { get, create } = require("./orders.service");
const { isLogged, isAdmin } = require("../middlewares");

router.get("/", isLogged, get);
router.post("/add", isLogged, create);

module.exports = router;
