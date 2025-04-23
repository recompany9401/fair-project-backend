const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    // 상호명
    type: String,
    required: true,
  },
  businessNumber: {
    type: String,
    required: true,
    unique: true,
  },
  representativeName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  businessType: {
    type: String,
  },
  businessCategory: {
    type: String,
  },
  managerName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  role: {
    type: String,
    default: "BUSINESS",
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BusinessSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Business", BusinessSchema);
