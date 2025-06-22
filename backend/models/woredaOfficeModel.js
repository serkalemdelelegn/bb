const mongoose = require("mongoose");

const woredaOfficeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
    },
    email: {
      type: String,
    },

    subCityOffice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCityOffice",
      required: [true, "Sub City Office field is required"],
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

const WoredaOffice = mongoose.model("WoredaOffice", woredaOfficeSchema);

module.exports = WoredaOffice;
