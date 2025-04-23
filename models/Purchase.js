const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
    required: true,
  },
  buyerName: { type: String, default: "" },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
  },
  dongHo: { type: String, default: "" },
  itemCategory: { type: String, required: true },
  businessName: { type: String, required: true },
  productName: { type: String, required: true },
  option: { type: String, required: true },
  price: { type: Number, required: true },
  discountOrSurcharge: { type: Number, default: 0 },
  finalPrice: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  contractDate: { type: Date },
  installationDate: { type: Date },
  note: { type: String, default: "" },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});

PurchaseSchema.pre("save", function (next) {
  if (!this.finalPrice || this.finalPrice === 0) {
    this.finalPrice = this.price - (this.discountOrSurcharge || 0);
  }
  next();
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
