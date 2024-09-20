"use strict";

/**
 * Initializes OTP routes for the application.
 *
 * @param {Object} app - The application instance.
 */
module.exports = function (app) {
  require("./OTPManagement.routes")(app);
};
