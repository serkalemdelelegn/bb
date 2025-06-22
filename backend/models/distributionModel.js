const mongoose = require("mongoose");
const RetailerCooperativeShop = require("./retailerCooperativeShopModel");
const RetailerCooperative = require("./retailerCooperativeModel");
const Commodity = require("./commodityModel");

const distributionSchema = new mongoose.Schema(
  {
    retailerCooperativeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RetailerCooperative",
      required: [true, 'Retailer Cooperative ID field is required'],
    },

    retailerCooperativeShopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RetailerCooperativeShop",
      required: [true, 'Retailer Cooperative Shop ID field is required'],
      index: true
    },

    amount: { type: Number, required: [true, 'Amount field is required'], min: 0 },

    commodity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commodity",
      required: [true, 'Commodity field is required'],
    },

    date: { type: Date, default: Date.now },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected", "failed"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

distributionSchema.post("create", async (doc) => {
  try {
    const fromEntity = await RetailerCooperative.findById(doc.retailerCooperativeId);
    if (fromEntity) {
      fromEntity.distributions.push(doc._id);
      await fromEntity.save();
    }

    const toEntity = await RetailerCooperativeShop.findById(doc.retailerCooperativeShopId);
    if (toEntity) {
      toEntity.distributions.push(doc._id);
      await toEntity.save();
    }
  } catch (error) {
    console.error(error);
  }
});

const Distribution = mongoose.model("Distribution", distributionSchema);

module.exports = Distribution;