const mongoose = require("mongoose");

const retailerCooperativeShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
    },

    retailerCooperative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RetailerCooperative",
      required: [true, "Retailer Cooperative field is required"],
      index: true
    },

    availableCommodity: [
      {
        commodity: { type: mongoose.Schema.Types.ObjectId, ref: "Commodity" },
        quantity: Number,
      },
    ],
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    ],
    distributions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Distribution" },
    ],
    alerts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alert" }],
    files: {
      sent: [String],
      received: [String],
    },
  },
  {
    timestamps: true,
  }
);

retailerCooperativeShopSchema.pre(/^find/, function (next) {
  this.populate("retailerCooperative", "name").populate('availableCommodity.commodity', 'name price unit');
  next();
});

const RetailerCooperativeShop = mongoose.model(
  "RetailerCooperativeShop",
  retailerCooperativeShopSchema
);

module.exports = RetailerCooperativeShop;
