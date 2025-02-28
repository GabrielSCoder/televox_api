'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class PostReaction extends Model {
    static associate(models) {

      PostReaction.belongsTo(models.Usuario, {
        foreignKey : 'usuario_id',
        as : 'usuario'
      })

      PostReaction.belongsTo(models.Post, {
        foreignKey : 'post_id',
        as : 'post'
      })
    }
  }

  PostReaction.init({
    usuario_id: DataTypes.INTEGER,
    post_id : DataTypes.INTEGER,
    data_criacao : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PostReaction',
    tableName: 'post_reaction',
    timestamps: false
  });
  return PostReaction;
};