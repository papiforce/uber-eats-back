const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const mealSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["MEAL", "DESSERT"],
  },
  quantity: {
    type: Number,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const MealModel = model("Meal", mealSchema);

module.exports = MealModel;
