'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("notificacao", {
      id : {type : Sequelize.INTEGER, allowNull : false, autoIncrement : true, primaryKey : true },
      tipo : {type : Sequelize.TEXT, allowNull : false},
      usuario_id : {type : Sequelize.INTEGER, allowNull : false, references : {model : "usuario", key : "id"}, onDelete : "CASCADE", onUpdate : "CASCADE"},
      usuario_destino : {type : Sequelize.INTEGER, allowNull : true, references : {model : "usuario", key : "id"}, onDelete : "CASCADE", onUpdate : "CASCADE"},
      post_id : {type : Sequelize.INTEGER, allowNull : true, references : {model : "post", key : "id"}, onDelete : "CASCADE", onUpdate : "CASCADE"},
      data_criacao: {allowNull: false, type: Sequelize.DATE},
      data_modificao: {allowNull : true, type: Sequelize.DATE}
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("notificacao")
  }
};
