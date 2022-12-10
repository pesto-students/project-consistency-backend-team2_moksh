const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    habits: { type: Object, default: {} }, ///must be in lowercase
    todos: { type: Object, default: {} },
  },
  { minimize: false }
);

const model = mongoose.model("user-details", schema);
module.exports = model;
