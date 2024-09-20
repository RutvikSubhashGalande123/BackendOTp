const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const winston = require("winston");
require("winston-daily-rotate-file");
const { createGzip } = require("zlib");
const { pipeline } = require("stream");
const { promisify } = require("util");

const pipe = promisify(pipeline);

class CentralizedLogger {
  constructor(options = {}) {
    this.options = {
      logDir: options.logDir || "logs",
      logLevel: options.logLevel || "info",
      maxSize: options.maxSize || "20m",
      maxFiles: options.maxFiles || "14d",
      zippedArchive: options.zippedArchive !== false,
      ...options,
    };

    this.initLogger();
    this.startPerformanceMonitoring();
  }

  initLogger() {
    const { combine, timestamp, printf, colorize, errors } = winston.format;

    const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}] : ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    });

    const fileRotateTransport = new winston.transports.DailyRotateFile({
      filename: path.join(this.options.logDir, "%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: this.options.zippedArchive,
      maxSize: this.options.maxSize,
      maxFiles: this.options.maxFiles,
      level: this.options.logLevel,
    });

    this.logger = winston.createLogger({
      level: this.options.logLevel,
      format: combine(errors({ stack: true }), timestamp(), logFormat),
      transports: [
        fileRotateTransport,
        new winston.transports.Console({
          format: combine(colorize(), logFormat),
        }),
      ],
    });

    this.logger.on("error", (error) => {
      console.error("Error in logger: ", error);
    });
  }

  log(level, message, metadata = {}) {
    if (this.logger) {
      this.logger.log(level, message, metadata);
    } else {
      console.error("Logger not initialized");
      console.log(`${level}: ${message}`, metadata);
    }
  }

  startPerformanceMonitoring() {
    setInterval(() => {
      const usage = process.memoryUsage();
      const cpuUsage = process.cpuUsage();
      const freeMemory = os.freemem();
      const totalMemory = os.totalmem();

      this.log("info", "System Performance", {
        memory: {
          rss: this.formatBytes(usage.rss),
          heapTotal: this.formatBytes(usage.heapTotal),
          heapUsed: this.formatBytes(usage.heapUsed),
          external: this.formatBytes(usage.external),
          freeMemory: this.formatBytes(freeMemory),
          totalMemory: this.formatBytes(totalMemory),
          memoryUsagePercentage:
            (((totalMemory - freeMemory) / totalMemory) * 100).toFixed(2) + "%",
        },
        cpu: {
          user: cpuUsage.user,
          system: cpuUsage.system,
        },
        uptime: this.formatUptime(process.uptime()),
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      });
    }, 60000); // Log every minute
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  }

  async compressOldLogs() {
    const files = await fs.readdir(this.options.logDir);
    const today = new Date().toISOString().split("T")[0];

    for (const file of files) {
      if (file.endsWith(".log") && !file.startsWith(today)) {
        const filePath = path.join(this.options.logDir, file);
        const gzipPath = `${filePath}.gz`;

        const source = fs.createReadStream(filePath);
        const destination = fs.createWriteStream(gzipPath);
        const gzip = createGzip();

        await pipe(source, gzip, destination);
        await fs.unlink(filePath);

        this.log("info", `Compressed old log file: ${file}`);
      }
    }
  }

  // HTTP request logging
  logHTTPRequest(req, res, next) {
    const startHrTime = process.hrtime();

    res.on("finish", () => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

      this.log("info", "HTTP Request", {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: elapsedTimeInMs,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      });
    });

    next();
  }

  // Database query logging
  logDBQuery(query, parameters) {
    this.log("debug", "Database Query", {
      query: query,
      parameters: parameters,
    });
  }

  // Error logging
  logError(error, req = null) {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    };

    if (req) {
      errorLog.httpDetails = {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        body: req.body,
      };
    }

    this.log("error", "Application Error", errorLog);
  }
}

// Create and export a singleton instance of the logger
const logger = new CentralizedLogger({
  logDir: "logs",
  logLevel: process.env.LOG_LEVEL || "info",
  maxSize: "50m",
  maxFiles: "14d",
  zippedArchive: true,
});

// Compress old logs daily
setInterval(() => {
  logger.compressOldLogs().catch((err) => {
    logger.log("error", "Failed to compress old logs", { error: err.message });
  });
}, 24 * 60 * 60 * 1000);

module.exports = logger;
