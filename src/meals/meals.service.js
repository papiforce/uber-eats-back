const MealModel = require("./meals.model");
const { logDisplayer } = require("../utils");

/**
 * GET - Menu list
 * @return Menu[] | []
 */

const get = async (req, res) => {
  try {
    const { onlyActive = "true", search } = req.query;

    const menu = await MealModel.find({
      ...(onlyActive === "true" && { isAvailable: true }),
      ...(search && { name: { $regex: search, $options: "i" } }),
    });

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json(menu);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * POST - Meal
 * @param { name: string, description: string, price: number, photo: string, time: number, type: "MEAL" | "DESSERT" }
 *
 * @return { success: boolean }
 */

const add = async (req, res) => {
  try {
    const { name, description, price, photo, time, type, quantity } = req.body;

    const meal = await MealModel.findOne({ name: name });

    if (meal) {
      return res.status(404).json({ error: "Ce produit existe déjà" });
    }

    const mealDoc = MealModel({
      name,
      description,
      price,
      photo,
      time,
      type,
      quantity,
    });

    await mealDoc.save();

    logDisplayer("INFO", `(POST) ${req.originalUrl} : 200`);

    return res.json({ success: true });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * PUT - Meal
 * @param { name?: string, description?: string, price?: number, photo?: string, time?: number, type?: "MEAL" | "DESSERT" }
 *
 * @return Meal
 */

const updateMeal = async (req, res) => {
  try {
    const meal = await MealModel.findById(req.params.mealId);

    if (!meal)
      return res.status(404).json({ error: "Ce produit n'existe pas" });

    const updatedMeal = Object.assign(meal, req.body);

    await updatedMeal.save();

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json(updatedMeal);
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

/**
 * DELETE - MEal
 * @return { success: boolean }
 */

const remove = async (req, res) => {
  try {
    const meal = await MealModel.findByIdAndDelete(req.params.mealId);

    if (!meal)
      return res.status(404).json({ error: "Ce produit n'existe pas" });

    logDisplayer("INFO", `GET - ${req.originalUrl} : 200`);

    return res.json({ success: true });
  } catch (error) {
    logDisplayer("ERROR", error);
    return res.status(500).send(error);
  }
};

module.exports = { get, add, updateMeal, remove };
