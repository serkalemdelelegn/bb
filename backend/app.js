const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load .env variables

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

// Routers
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
const entitiesRouter = require("./routers/allEntities");

const app = express();

// Body parser
app.use(express.json({ limit: "10kb" }));

// Enable CORS for frontend
app.use(cors({
  origin: "http://49.12.106.102" ,
  credentials: true
}));

// Set Security HTTP headers
app.use(helmet());

// Log requests to file in production
if (process.env.NODE_ENV === "production") {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "logs", "access.log"),
    { flags: "a" }
  );
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  app.use(morgan("dev"));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many requests from this IP. Try again later."
});
app.use("/api", limiter);

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Compression
app.use(compression());

// API routes
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

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
