const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  role: { type: String, default: "ADMIN" },
  createdAt: { type: Date, default: Date.now },
});

AdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

module.exports = mongoose.model("Admin", AdminSchema);
