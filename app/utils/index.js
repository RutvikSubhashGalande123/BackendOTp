const callAxiosAPI = require("./ApiCaller");
const secondsToMinutes = require("./SecondsToMinutes");
const generateCustomRandomNumber = require("./GenerateCustomRandomNumber");
const generateOTPTemplate = require("./GenerateOTPTemplate");
const generateOTPTemplateTMS = require("./GenerateOTPTemplateTMS");
const SendEmail = require("./SendEmail");
const generateMailOtpTemplate = require("./GenerateOTPTemplateTMS");
const successResponse = require("./GenerateSuccessResponse");
const errorResponse = require("./GenerateErrorResponse");
const sendOTPViaDesignHost = require("./SendOtpViaDesignHost");
const sendOTPViaSinthan = require("./SendOtpViaSinthan");
const sendOTPViaSinthanTMS = require("./SendOTPViaSinthanTMS");
const sentOTPDetailsData = require("./SentOtpDetails");

module.exports = {
  callAxiosAPI,
  secondsToMinutes,
  generateCustomRandomNumber,
  generateOTPTemplate,
  generateMailOtpTemplate,
  generateOTPTemplateTMS,
  SendEmail,
  successResponse,
  errorResponse,
  sendOTPViaDesignHost,
  sendOTPViaSinthan,
  sendOTPViaSinthanTMS,
  sentOTPDetailsData
};
