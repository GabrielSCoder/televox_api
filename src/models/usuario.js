'use strict';
const {Model} = require('sequelize');
const bcrypt = require("bcrypt")
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {

    check(password) {
      return bcrypt.compareSync(password, this.senha);
    }

    static associate(models) {
      usuario.hasMany(models.post, {
        foreignKey : 'usuario_id',
        as : 'posts'
      })
    }
  }
  
  usuario.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    senha: DataTypes.STRING,
    data_nascimento : DataTypes.DATE,
    genero : DataTypes.CHAR,
    img_url : DataTypes.STRING,
    data_criacao : DataTypes.DATE,
    data_edicao : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'usuario',
    tableName: 'usuario',
    timestamps: false,
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.senha = await bcrypt.hash(user.senha, salt);
      },
      beforeUpdate: async (user) => {
        if (user.changed("senha")) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      }
    }
  },);
  return usuario;
};