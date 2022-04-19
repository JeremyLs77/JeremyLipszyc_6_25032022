// Imports
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Modeles
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Controle de l'unicité
userSchema.plugin(uniqueValidator);

// Exports
module.exports = mongoose.model("User", userSchema);
