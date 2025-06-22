const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const globalErrorHandler = require("./controllers/errorController");

// Import routes
const tradeBureauRouter = require("./routers/tradeBureauRouter");
const subCityOfficeRouter = require("./routers/subCityOfficeRouter");
const woredaOfficeRouter = require("./routers/woredaOfficeRouter");
const uploadRouter = require("./routers/uploadRouter");
const alertsRouter = require("./routers/alertRouter");
const retailerCooperativeRouter = require("./routers/retailerCooperativeRouter");
const retailerCooperativeShopRouter = require("./routers/retailerCooperativeShopRouter");
const distributionRouter = require("./routers/distributionRouter");
const transactionRouter = require("./routers/transactionRouter");
const userRouter = require("./routers/userRouter");
const commodityRouter = require("./routers/commodityRouter");
const customerRouter = require("./routers/customerRouter");
const allocationRouter = require("./routers/allocationRouter");
const reportRouter = require("./routers/reportRouter");
const AppError = require("./utils/appError");
const entitiesRouter = require("./routers/allEntities");

const app = express();

app.use(express.json());

// CORS
app.use(cors({
  origin: "http://localhost:4000", // your frontend origin
  credentials: true,               // allow cookies to be sent
}));

// Set security HTTP headers
app.use(helmet());

// Development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Data sanitization against NoSQL query injections
app.use(mongoSanitize());

// Data sanitization agains XSS
app.use(xss());

app.use("/api/tradebureaus", tradeBureauRouter);
app.use("/api/subcityoffices", subCityOfficeRouter);
app.use("/api/woredaoffices", woredaOfficeRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/retailercooperatives", retailerCooperativeRouter);
app.use("/api/retailercooperativeshops", retailerCooperativeShopRouter);
app.use("/api/distributions", distributionRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/users", userRouter);
app.use("/api/commodities", commodityRouter);
app.use("/api/customers", customerRouter);
app.use("/api/allocations", allocationRouter);
app.use("/api/reports", reportRouter);

app.use("/api/entities", entitiesRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
