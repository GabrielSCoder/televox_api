'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("usuario", "img_url", {type : Sequelize.DataTypes.STRING, allowNull : false, defaultValue : ""}),
    await queryInterface.addColumn("usuario", "genero", {type: Sequelize.DataTypes.CHAR, allowNull: false, defaultValue : "M"})
    await queryInterface.addColumn("usuario", "data_nascimento", {type: Sequelize.DataTypes.DATEONLY, allowNull: false})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("usuario", "img_url")
    await queryInterface.removeColumn("usuario", "genero")
    await queryInterface.removeColumn("usuario", "data_nascimento")
  }
};
