const { OTPDetails, OTPDetailsArchives } = require("../models/models");
const db = require("../db/database.connection");
const connection = db.getConnection();

OTPDetails.addHook("beforeCreate", (OTPInstance) => {
  const expiryTime = process.env.OTP_EXPIRY_TIME;
  const deletionTimeout = setTimeout(async () => {
    try {
      await OTPInstance.destroy();
      console.log("Mobile OTP details deleted after 5 minutes");
    } catch (error) {
      console.error(`Error deleting old OTP details : ${error.message}`);
    }
  }, expiryTime * 1000);

  OTPInstance.deletionTimeout = deletionTimeout;
});

OTPDetails.beforeDestroy(async (instance, options) => {
  let transaction;
  try {
    transaction = await connection.transaction(options);
    await OTPDetailsArchives.create(instance.toJSON(), { transaction });
    await transaction.commit();
    console.log("Deleted records moved to archive table!");
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    throw error;
  }
});
