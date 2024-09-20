const { OTPDetails, OTPDetailsArchives } = require("../models/models");
const databaseManager = require("./databaseManager.service");
const addOTPDetails = async (mobileNumber, refNumber, OTPCode) => {
  try {
    const result = await databaseManager.addDetails(OTPDetails, {
      mobileNumber,
      refNumber,
      OTPCode,
    });
    console.log(result);

    console.log(
      `OTP details added successfully for mobile number: ${mobileNumber}`
    );
    return result;
  } catch (error) {
    console.error("Error adding OTP details:", error.message);
    throw error;
  }
};

const updateOTPDetails = async (OTPId, OTPCodeId) => {
  try {
    const result = await databaseManager.updateDetails(
      OTPDetails,
      { OTPId },
      { OTPCodeId }
    );
    console.log(result);

    if (result) {
      console.log(`OTP details updated successfully for OTPId: ${OTPId}`);
      return result; // Return the updated record
    } else {
      throw new Error(`No OTP details found for OTPId: ${OTPId}`);
    }
  } catch (error) {
    console.error("Error updating OTP details:", error.message);
    throw error;
  }
};

const verifyOTP = async (mobileNumber, OTPCode) => {
  try {
    const otpRecord = await databaseManager.getDetailsByKey(OTPDetails, {
      mobileNumber,
      OTPCode,
    });
    if (otpRecord) {
      // OTP is valid, now archive it
      await archiveOTP(otpRecord);
      // Delete the OTP from the active table
      await databaseManager.deleteDetails(OTPDetails, {
        OTPId: otpRecord.OTPId,
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    throw error;
  }
};

const archiveOTP = async (otpRecord) => {
  try {
    await databaseManager.addDetails(OTPDetailsArchives, {
      ...otpRecord.dataValues,
      verifiedAt: new Date(),
    });
    console.log(`OTP archived for mobile number: ${otpRecord.mobileNumber}`);
  } catch (error) {
    console.error("Error archiving OTP:", error.message);
    throw error;
  }
};

const getOTPHistory = async (mobileNumber, options = {}) => {
  try {
    const result = await databaseManager.getList(OTPDetailsArchives, {
      ...options,
      filters: { mobileNumber },
    });
    console.log(`Retrieved OTP history for mobile number: ${mobileNumber}`);
    return result;
  } catch (error) {
    console.error("Error retrieving OTP history:", error.message);
    throw error;
  }
};

const cleanupExpiredOTPs = async (expirationMinutes = 10) => {
  try {
    const expirationTime = new Date(Date.now() - expirationMinutes * 60000);
    const expiredOTPs = await databaseManager.getList(OTPDetails, {
      filters: {
        createdAt: { [Op.lt]: expirationTime },
      },
    });

    for (const otp of expiredOTPs.items) {
      await archiveOTP({ ...otp.dataValues, status: "EXPIRED" });
      await databaseManager.deleteDetails(OTPDetails, { OTPId: otp.OTPId });
    }

    console.log(`Cleaned up ${expiredOTPs.items.length} expired OTPs`);
  } catch (error) {
    console.error("Error cleaning up expired OTPs:", error.message);
    throw error;
  }
};

module.exports = {
  addOTPDetails,
  updateOTPDetails,
  verifyOTP,
  getOTPHistory,
  cleanupExpiredOTPs,
};
