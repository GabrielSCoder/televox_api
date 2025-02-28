'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {

      Post.belongsTo(models.Usuario, {
        foreignKey : 'usuario_id',
        as : 'usuario'
      })

      Post.hasMany(models.PostReaction, {
        foreignKey : "post_id",
        as : "reactions"
      })

    }
  }
  Post.init({
    tipo: DataTypes.STRING,
    conteudo: DataTypes.TEXT,
    usuario_id: DataTypes.INTEGER,
    data_criacao : DataTypes.DATE,
    data_modificao : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Post',
    tableName: 'post',
    timestamps: false
  });
  return Post;
};