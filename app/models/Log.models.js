const { DataTypes, Sequelize } = require("sequelize");
const db = require("../db/database.connection");
const connection = db.getConnection();

// Define the Log model
const Log = connection.define("Log", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  appName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  level: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dbQuery: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue("metadata");
      return value ? JSON.parse(value) : null;
    },
    set(value) {
      this.setDataValue("metadata", JSON.stringify(value));
    },
  },
});

module.exports = Log;
