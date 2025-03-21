const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_DEV,
    host: process.env.DB_HOST,
    dialect: "postgres"
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_PROD,
    host: process.env.DB_HOST,

    dialect: "postgres",
    ssl: {
      rejectUnauthorized: false,
    },
  },
  neon : {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false
      }
   },
    port : 5432
  }
};