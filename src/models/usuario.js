'use strict';
const {Model} = require('sequelize');
const bcrypt = require("bcrypt")
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {

    check(password) {
      return bcrypt.compareSync(password, this.senha);
    }

    static associate(models) {
      Usuario.hasMany(models.Post, {
        foreignKey : 'usuario_id',
        as : 'posts'
      })

      Usuario.hasMany(models.Seguidor, {
        foreignKey : 'follower_id',
        as : 'seguindo'
      })

      Usuario.hasMany(models.Seguidor, {
        foreignKey : 'following_id',
        as : 'seguidores'
      })

      Usuario.hasMany(models.Sessao, {
        foreignKey : "usuario_id",
        as : "sessoes"
      })

      Usuario.hasMany(models.PostReaction, {
        foreignKey : "usuario_id",
        as : "reacoes"
      })
    }
  }
  
  Usuario.init({
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    username : DataTypes.STRING,
    senha: DataTypes.STRING,
    data_nascimento : DataTypes.STRING,
    genero : DataTypes.CHAR,
    img_url : DataTypes.STRING,
    data_criacao : DataTypes.DATE,
    data_edicao : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Usuario',
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
  return Usuario;
};