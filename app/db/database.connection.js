const { Sequelize } = require("sequelize");
// const keys = require("../config/keys");

class Database {
  constructor() {
    // Local MySQL database credentials
    this.connection = new Sequelize(
      "otp service", 
      "root", 
      "", 
      {
        host: "localhost", 
        port: 3306, 
        dialect: "mysql", 
        logging: process.env.NODE_ENV === "production" ? false : console.log, 
      }
    );
  }

  async checkConnection() {
    try {
      await this.connection.authenticate();
      console.log(
        "Connection to the database has been established successfully."
      );
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    }
  }

  async dropAllModels() {
    try {
      await this.connection.drop();
      console.log("All models dropped!");
    } catch (error) {
      console.error("Error dropping models:", error);
      throw error;
    }
  }

  async syncAllModels() {
    try {
      // Sync all models, with force: true to drop existing tables
      await this.connection.sync({ force: true });
      console.log("All models were synchronized successfully.");
    } catch (error) {
      console.error("Error synchronizing models:", error);
      throw error;
    }
  }

  async closeConnection() {
    try {
      console.log("Closing database connection pool...");
      await this.connection.close();
      console.log("Database connection pool closed. Exiting process.");
    } catch (error) {
      console.error("Error closing database connection:", error);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = new Database();
