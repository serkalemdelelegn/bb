const mongoose = require("mongoose");

const tradeBureauSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,

    },
    allocations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Allocations",
        autopopulate: true,
      },
    ],
    alerts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alert",
        autopopulate: true,
      },
    ],
    files: {
      sent: [{ type: String, trim: true }],
      received: [{ type: String, trim: true }],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TradeBureau = mongoose.model("TradeBureau", tradeBureauSchema);

module.exports = TradeBureau;