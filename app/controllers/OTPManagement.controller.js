const twilio = require("twilio");
const OTPUtils = require("../utils");
const responseMessage = require("../constants/responseMessage.constants");
const MyController = require("./MY_CONTROLLER");
const otpService = require("../services/OTPServices.service");
const { PhoneNumberUtil, PhoneNumberFormat } = require("google-libphonenumber");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const phoneNumberUtil = PhoneNumberUtil.getInstance();

exports.sendOtp = async (req, res) => {
  try {
    const { mobileNumber, countryCode } = req.body;
    console.log("Request Body:", req.body);
    if (!countryCode || !countryCode.startsWith("+")) {
      return MyController.badRequestResponse(
        res,
        responseMessage.invalidCountryCode400
      );
    }
    const countryCodeWithoutPlus = countryCode.slice(1);
    let parsedNumber;
    try {
      const regionCode = phoneNumberUtil.getRegionCodeForCountryCode(
        Number(countryCodeWithoutPlus)
      );
      parsedNumber = phoneNumberUtil.parse(mobileNumber, regionCode);
      console.log("Parsed Number:", parsedNumber);
    } catch (error) {
      console.log("Parsing Error:", error);
      return MyController.badRequestResponse(
        res,
        responseMessage.invalidPhoneNumber400
      );
    }

    // Format the phone number to E.164 format
    const formattedNumber = phoneNumberUtil.format(
      parsedNumber,
      PhoneNumberFormat.E164
    );

    // Generate OTP and reference number
    const OTPCode = OTPUtils.generateCustomRandomNumber(6, "numeric");
    const refNumber = OTPUtils.generateCustomRandomNumber(4, "numeric");
    const OTPTemplate = OTPUtils.generateOTPTemplate(refNumber, OTPCode);

    // Save OTP details to the database
    let newOtpDetails = await otpService.addOTPDetails(
      mobileNumber,
      refNumber,
      OTPCode
    );

    if (newOtpDetails) {
      const { OTPId } = newOtpDetails;
      console.log("New OTP Details:", newOtpDetails);

      // Send OTP using Twilio
      const twilioResponse = await twilioClient.messages.create({
        body: OTPTemplate,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        to: formattedNumber,
      });

      if (twilioResponse.sid) {
        console.log("OTP sent successfully:", twilioResponse.sid, OTPId);
        const updatedOTP = await otpService.updateOTPDetails(
          OTPId,
          twilioResponse.sid
        );

        if (updatedOTP) {
          const sentDetails = OTPUtils.sentOTPDetailsData(
            twilioResponse.sid,
            refNumber
          );
          return MyController.successResponse(
            res,
            responseMessage.sentOTP200,
            sentDetails
          );
        } else {
          return MyController.badRequestResponse(
            res,
            responseMessage.failedSaveOTP400
          );
        }
      } else {
        return MyController.badRequestResponse(
          res,
          responseMessage.failedSentOTP400
        );
      }
    } else {
      return MyController.badRequestResponse(
        res,
        responseMessage.failedSaveOTP400
      );
    }
  } catch (error) {
    console.error(`[Controller] Error while sending OTP: ${error.message}`);
    return MyController.internalErrorResponse(res, error.message);
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, OTPCode } = req.body;

    const isVerified = await otpService.verifyOTP(mobileNumber, OTPCode);

    if (isVerified) {
      return MyController.successResponse(res, responseMessage.verifiedOTP200, {
        verified: true,
      });
    } else {
      return MyController.badRequestResponse(
        res,
        responseMessage.failedVerifyOTP400
      );
    }
  } catch (error) {
    console.log(
      `[Controller] Error while verifying OTP Code : ${error.message}`
    );
    return MyController.internalErrorResponse(res, error.message);
  }
};

// New function to get OTP history
exports.getOtpHistory = async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    const { page, pageSize } = req.query;

    const history = await otpService.getOTPHistory(mobileNumber, {
      page,
      pageSize,
    });

    return MyController.successResponse(
      res,
      responseMessage.otpHistoryRetrieved200,
      history
    );
  } catch (error) {
    console.log(
      `[Controller] Error while retrieving OTP history : ${error.message}`
    );
    return MyController.internalErrorResponse(res, error.message);
  }
};

// New function to clean up expired OTPs
exports.cleanupExpiredOtps = async (req, res) => {
  try {
    const { expirationMinutes } = req.body;

    await otpService.cleanupExpiredOTPs(expirationMinutes);

    return MyController.successResponse(
      res,
      responseMessage.expiredOTPsCleanedUp200
    );
  } catch (error) {
    console.log(
      `[Controller] Error while cleaning up expired OTPs : ${error.message}`
    );
    return MyController.internalErrorResponse(res, error.message);
  }
};
