const secondsToMinutes = require("./SecondsToMinutes");

const generateOTPTemplateTMS = (refNumber, otpCode, name) => {
  const otpExpiry = process.env.OTP_EXPIRY_TIME;
//   const number = secondsToMinutes(otpExpiry).toString();
  return `Dear ${name}, Your OTP code is ${otpCode} for your ASHOKA TODAY Portal booking with Ref No. ${refNumber}. This OTP is valid for 10 minutes only. ASHOKA TODAY TECHNOLOGY PRIVATE LIMITED`;
};
module.exports = generateOTPTemplateTMS;
