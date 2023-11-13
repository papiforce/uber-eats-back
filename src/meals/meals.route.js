const router = require("express").Router();
const { get, add, updateMeal } = require("./meals.service");
const { isLogged, isAdmin } = require("../middlewares");

router.get("/", get);
router.post("/add", isLogged, isAdmin, add);
router.put("/update/:mealId", isLogged, isAdmin, updateMeal);

module.exports = router;
