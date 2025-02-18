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
    }
  }
  Post.init({
    tipo: DataTypes.STRING,
    conteudo: DataTypes.TEXT,
    usuario_id: DataTypes.INTEGER,
    reacao_gostei: DataTypes.INTEGER,
    reacao_nao_gostei: DataTypes.INTEGER,
    qtd_comentarios: DataTypes.INTEGER,
    qt_compartilhamentos: DataTypes.INTEGER,
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