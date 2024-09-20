"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const { v4: uuidv4 } = require("uuid");
const swaggerUi = require("swagger-ui-express");
const apicache = require("apicache");

require("dotenv").config({ path: "./.env" });
const keys = require("./app/config/keys");
const { ALLOWED_ORIGINS } = require("./app/constants/allowedOrigins.constants");
const { ALLOWED_METHODS } = require("./app/constants/alllowedMethod.constants");
const db = require("./app/db/database.connection");

const logger = require("./app/utils/centralizedLogger");

const app = express();

app.use((req, res, next) => {
  logger.log("info", "Incoming request", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });
  next();
});
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use(limiter);

app.use(compression());

app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ALLOWED_METHODS,
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: ["application/json"], limit: "50mb" }));

app.use(apicache.middleware("5 minutes"));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});



require("./app/routes/v1/index.routes")(app);

// Default route
app.get("*", (req, res) => {
  logger.log("warn", "Not Found", { url: req.originalUrl });
  res.redirect(301, keys.NOT_FOUND_URL);
});

app.use((err, req, res, next) => {
  logger.log("error", "Application error", {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });
  res.status(500).json({ error: "Internal Server Error" });
});


process.on("SIGINT", async () => {
  logger.log("info", "Received SIGINT. Shutting down gracefully");
  await db.closeConnection();
  process.exit(0);
});

// Uncaught exception handler
process.on("uncaughtException", (error) => {
  logger.log("error", "Uncaught Exception", { error: error.stack });
  process.exit(1);
});

// Unhandled promise rejection handler
process.on("unhandledRejection", (reason, promise) => {
  logger.log("error", "Unhandled Rejection", { reason: reason });
});

// Start the server
app.listen(keys.PORT, () => {
  logger.log("info", "Server started", {
    port: keys.PORT,
    environment: process.env.NODE_ENV,
    apiServerName: process.env.API_SERVER_NAME,
    appUrl: keys.APP_URL,
  });

  db.checkConnection()
    .then(() => {
      logger.log("info", "Database connection established");
    })
    .catch((error) => {
      logger.log("error", "Database connection failed", {
        error: error.message,
      });
    });

  require("./app/services/createModels");
  require("./app/services/triggerHooks");
});

module.exports = app;
