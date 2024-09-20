const { logFatal } = require("../utils/BunyanLogger");

// Error handling function
const handleFatalError = (error) => {
  console.error(error); // Log the error to console
  logFatal.fatal({ dbQuery: { err: error } }); // Log the error using BunyanLogger

  if (error instanceof Error) {
    console.error(error.message); 
    console.error(error.stack); 
  }
  process.exit(1); 
};
process.on("unhandledRejection", handleFatalError);
process.on("uncaughtException", handleFatalError);
