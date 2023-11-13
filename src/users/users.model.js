const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    select: false,
  },
  roles: {
    type: [String],
    required: true,
    enum: ["MEMBER", "DELIVERY_PERSON", "ADMIN"],
    default: "MEMBER",
  },
});

const UserModel = model("User", userSchema);

module.exports = UserModel;
