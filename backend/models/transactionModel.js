const mongoose = require("mongoose");
const RetailerCooperativeShop = require("./retailerCooperativeShopModel");

const transactionSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RetailerCooperativeShop",
      required: [true, "Shop ID field is required"],
    },
    customerIDNumber: {
      type: String,
      required: [true, 'Customer id number field is required']
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer ID field is required"],
    },

    amount: {
      type: Number,
      required: [true, "Amount field is required"],
      min: 0,

      validate: {
        validator: (value) => {
          return value >= 0;
        },
        message: "Amount must be a non-negative number",
      },

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
      enum: ["pending", "success", "failed", "expired"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User field is required"],
    },
    
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ shopId: 1 });
transactionSchema.index({createdAt: 1});

transactionSchema.post("save", async (doc) => {
  doc.status = "success";
  const shop = await RetailerCooperativeShop.findById(doc.shopId);
  if (shop) {
    shop.transactions.push(doc._id);
    await shop.save();
  }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
