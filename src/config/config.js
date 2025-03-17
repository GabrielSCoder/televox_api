const dotenv = require("dotenv");
dotenv.config();

console.log("DB_USER:", process.env.DB_PASSWORD);

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, 
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: "root", 
    password: null,
    database: "database_test",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    
    username: "root",
    password: null,
    database: "database_production",
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};
