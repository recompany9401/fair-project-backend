const mongoose = require("mongoose");

const BuyerSchema = new mongoose.Schema({
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
    // 계약자명
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  dong: {
    type: String,
    required: true,
  },
  ho: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["M", "F", "OTHER"],
  },
  householdCount: {
    type: Number,
  },
  personalInfoAgreement: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "BUYER",
  },
  approved: {
    type: Boolean,
    default: false, // 관리자 승인 여부
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

BuyerSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Buyer", BuyerSchema);
