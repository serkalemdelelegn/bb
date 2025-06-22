const mongoose = require("mongoose");

const subCityOfficeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email field is required'],
      unique: true,
      lowercase: true,
    },
    tradeBureau: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TradeBureau",
      required: [true, "Trade Bureau field is required"],
    },

    files: {
      sent: [{ type: String, trim: true }],
      received: [{ type: String, trim: true }],
    },
    alerts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alert" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const SubCityOffice = mongoose.model("SubCityOffice", subCityOfficeSchema);

module.exports = SubCityOffice;