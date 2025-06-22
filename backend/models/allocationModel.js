const mongoose = require("mongoose");
const TradeBureau = require("./tradeBureauModel");
const RetailerCooperative = require("./retailerCooperativeModel");

const allocationSchema = new mongoose.Schema(
  {
    tradeBureauId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TradeBureau",
      required: [true, "Trade Bureau field is required"],
    },

    retailerCooperativeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RetailerCooperative",
      required: [true, "Retailer Cooperative field is required"],
      index: true
    },

    amount: {
      type: Number,
      required: [true, "Amount field is required"],
      min: 0,
    },

    commodity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commodity",
      required: [true, "Commodity field is required"],
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
  }
);

allocationSchema.index({createdAt: 1})

allocationSchema.post("save", async (doc) => {
  const fromEntity = await TradeBureau.findById(doc.tradeBureauId);
  if (fromEntity) {
    fromEntity.allocations.push(doc._id);
    await fromEntity.save();
  }

  const toEntity = await RetailerCooperative.findById(
    doc.retailerCooperativeId
  );
  if (toEntity) {
    toEntity.allocations.push(doc._id);
    await toEntity.save();
  }
});

const Allocation = mongoose.model("Allocation", allocationSchema);

module.exports = Allocation;
