const mongoose = require("mongoose");
const WoredaOffice = require("./woredaOfficeModel");
const SubCityOffice = require("./subCityOfficeModel");
const TradeBureau = require("./tradeBureauModel");
const RetailerCooperative = require("./retailerCooperativeModel");
const RetailerCooperativeShop = require("./retailerCooperativeShopModel");
const sendEmail = require("../utils/email");

const alertSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "fromModel",
      required: [true, 'From field is required'],
      index: true
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "toModel",
      required: [true, 'To field is required'],
      index: true
    },

    fromModel: {
      type: String,
      required: [true, 'From Model field is required'],
      enum: [
        "TradeBureau",
        "SubCityOffice",
        "WoredaOffice",
        "RetailerCooperative",
        "RetailerCooperativeShop",
      ],
    },

    toModel: {
      type: String,
      required: [true, 'To Model field is required'],
      enum: [
        "TradeBureau",
        "SubCityOffice",
        "WoredaOffice",
        "RetailerCooperative",
        "RetailerCooperativeShop",
      ],
    },

    message: {
      type: String,
      required: [true, 'Message field is required'],
    },

    file: [{ type: String }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    status: {
      type: String,
      enum: ["sent", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

alertSchema.index({createdAt: 1})

alertSchema.pre("find", function () {
  this.populate("user", "name").populate("from", "name").populate("to", "name");
});

// Post-save middleware
alertSchema.post("save", async (doc) => {
  const fromEntity = await getEntityById(doc.from, doc.fromModel);
  if (fromEntity) {
    fromEntity.alerts.push(doc._id);
    fromEntity.files.sent.push(...doc.file);
    await fromEntity.save();
  }

  const toEntity = await getEntityById(doc.to, doc.toModel);
  if (toEntity) {
    toEntity.alerts.push(doc._id);
    toEntity.files.received.push(...doc.file);
    await toEntity.save();
    sendEmail(toEntity.email, 'Bole-PDS Notification', `You have a new alert from ${fromEntity.name} with message: ${doc.message}. For more details, visit: [Random Link](http://example.com)`)

      .then(() => console.log('Email sent successfully!'))
      .catch((error) => console.error('Error sending email:', error));
  }
});

async function getEntityById(id, modelType) {
  switch (modelType) {
    case "TradeBureau":
      return await TradeBureau.findById(id);
    case "WoredaOffice":
      return await WoredaOffice.findById(id);
    case "SubCityOffice":
      return await SubCityOffice.findById(id);
    case "RetailerCooperative":
      return await RetailerCooperative.findById(id);
    case "RetailerCooperativeShop":
      return await RetailerCooperativeShop.findById(id);
    default:
      return null;
  }
}

module.exports = mongoose.model("Alert", alertSchema);
