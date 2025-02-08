'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      post.belongsTo(models.usuario, {
        foreignKey : 'usuario_id',
        as : 'usuario'
      })
    }
  }
  post.init({
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
    modelName: 'post',
    tableName: 'post',
    timestamps: false
  });
  return post;
};