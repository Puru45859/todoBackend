var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var newSchema = new Schema({
  email: { type: String, unique: true },
  password: { type: String },
  contactNumber: [],
  username: { type: String },
  token: { type: String },
  emailToken: { type: String, unique: true },
  isActive: { type: Boolean, default: false },
  creationDate: { type: Date },
  updationDate: { type: Date },
  oldPass: { type: String },
  newPass: { type: String },
});

module.exports = mongoose.model("user", newSchema);
