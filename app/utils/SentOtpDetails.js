function sentOTPDetailsData(reqId, refNumber) {
  return {
    expiry: process.env.OTP_EXPIRY_TIME,
    otpCodeId: reqId,
    status: "Created",
    refId: refNumber,
  };
}

module.exports = sentOTPDetailsData;