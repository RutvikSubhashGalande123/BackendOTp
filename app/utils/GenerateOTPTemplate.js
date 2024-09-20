const secondsToMinutes = require("./SecondsToMinutes");

const generateOTPTemplate = (refNumber, otpCode) => {
  const otpExpiry = process.env.OTP_EXPIRY_TIME;
  const number = secondsToMinutes(otpExpiry).toString();
  return `Dear Customer, Your OTP Code is ${otpCode} to verify the mobile number associated with Reference No. ${refNumber}. This OTP is valid for ${number} minutes only. Please do not share it with anyone. GOjii`;
};
module.exports = generateOTPTemplate;
