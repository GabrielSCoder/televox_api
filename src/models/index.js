const { Sequelize } = require("sequelize");
const config = require("../config/config.js")["development"];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Usuario = require("./usuario.js")(sequelize, Sequelize.DataTypes);
db.Post = require("./post.js")(sequelize, Sequelize.DataTypes);
db.Seguidor = require("./follower.js")(sequelize, Sequelize.DataTypes);


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
