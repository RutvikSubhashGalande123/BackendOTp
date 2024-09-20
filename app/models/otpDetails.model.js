const { DataTypes } = require("sequelize");
const db = require("../db/database.connection");
const connection = db.getConnection();

const OtpDetailsSchema = connection.define(
  "OtpDetails",
  {
    OTPId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "OTP_id",
    },
    mobileNumber: {
      type: DataTypes.STRING(15),
      validate: {
        is: /^\d{10}$/,
      },
      allowNull: false,
      field: "mobile_number",
    },
    refNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ref_number",
    },
    OTPCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "OTP_code",
    },
    OTPCodeId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "OTP_code_id",
    },
    OTPExpiry: {
      type: DataTypes.INTEGER,
      defaultValue: process.env.OTP_EXPIRY_TIME,
      field: "OTP_expiry",
    },
    status: {
      type: DataTypes.STRING(10),
      defaultValue: "Created",
      field: "status",
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "OTP_details",
  }
);

module.exports = OtpDetailsSchema;
