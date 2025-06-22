const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
    },
    ID_No: {
      type: String,
      required: [true, "Id Number is required"],
      unique: true,
    },
    house_no: {
      type: String,
      // required: [true, 'House number is required']
    },
    woreda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WoredaOffice",
      required: [true, "Woreda field is required"],
      index: true
    },
    phone: {
      type: String,
      required: [true, "Phone field is required"],
      unique: true,
      validate: {
        validator: (v) => {
          return /\d{10}/.test(v);
        },
        message: "{VALUE} is not a valid phone number",
      },
    },
    ketena: {
      type: String,
      required: [true, "Ketena field is required"],
    },
    numberOfFamilyMembers: {
      type: Number,
      required: [true, "Number of family members field is required"],
      min: [1, "Number of family members must be at least 1"],
    },

    retailerCooperativeShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RetailerCooperativeShop",
      required: [true, "Retailer Cooperative Shop field is required"],
      index: true
    },
    status: {
      type: String,
      enum: ["available", "taken"],
      default: "available",
    },
    purchasedCommodities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commodity",
      },
    ],
    lastTransactionDate: Date,
  },

  { timestamps: true }
);

customerSchema.pre("findOne", function (next) {
  this.populate("retailerCooperativeShop", "name");
  next();
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
