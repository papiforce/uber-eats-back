const router = require("express").Router();
const { get, add, updateMeal } = require("./meals.service");
const { isLogged, hasRole } = require("../middlewares");

router.get("/", get);
router.post("/add", isLogged, hasRole("ADMIN"), add);
router.put("/update/:mealId", isLogged, hasRole("ADMIN"), updateMeal);

module.exports = router;
