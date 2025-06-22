const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    retailerCooperativeShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RetailerCooperativeShop",
      required: true,
    },
    date: {

      type: String,
      default: () => new Date().toISOString().split("T")[0],

    },
    customers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
    ],
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true,
      },
    ],
    commodities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commodity",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
