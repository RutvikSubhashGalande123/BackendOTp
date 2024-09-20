const MyController = require("../../controllers/MY_CONTROLLER");
const OTPController = require("../../controllers/OTPManagement.controller");
const logger = require("../../utils/centralizedLogger");

const API_VERSION = process.env.SERVER_API_VERSION;

module.exports = function (app) {
  const OTPRoutes = [
    {
      path: "generate",
      method: process.env.METHOD_POST_SMALL,
      handler: OTPController.sendOtp,
    },
    {
      path: "verify",
      method: process.env.METHOD_POST_SMALL,
      handler: OTPController.verifyOtp,
    },
  ];

  OTPRoutes.forEach((route) => {
    const fullPath = `${API_VERSION}OTP/${route.path}`;
    logger.log("info", "routes", fullPath);

    app[route.method](fullPath, MyController.asyncHandler(route.handler));
  });
};
