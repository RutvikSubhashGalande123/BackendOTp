const { DataTypes } = require("sequelize");
const db = require("../db/database.connection");
const connection = db.getConnection();

const OtpDetailsArchivesSchema = connection.define('OtpDetailsArchives', {
    achiveId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'archive_id'
    },
    otpId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'otp_id'
    },
    mobileNumber: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: 'mobile_number'
    },
    refNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'ref_number'
    },
    otpCode: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: 'otp_code'
    },
    otpCodeId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'otp_code_id'
    },
    otpExpiry: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'otp_expiry'
    },
    status: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: 'status'
    }
},
    {
        timestamps: true,
        createdAt: true,
        updatedAt: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: "otp_details_archives",
    });

module.exports = OtpDetailsArchivesSchema;