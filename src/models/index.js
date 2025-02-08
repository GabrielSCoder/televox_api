const { Sequelize } = require("sequelize");
const config = require("../config/config.js")["development"];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {
  sequelize,
  Sequelize,
  User: require("./usuario.js")(sequelize, Sequelize.DataTypes),
  Post: require("./post.js")(sequelize, Sequelize.DataTypes)
};

module.exports = db;
