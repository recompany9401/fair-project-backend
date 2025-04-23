const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  businessName: {
    type: String,
    required: true,
  },
  itemCategory: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  option: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
