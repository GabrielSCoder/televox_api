'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("usuario", "texto_bio", {type : Sequelize.DataTypes.TEXT, allowNull : true})
    await queryInterface.addColumn("usuario", "background_url", {type : Sequelize.DataTypes.TEXT, allowNull : true})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("usuario", "texto_bio")
    await queryInterface.removeColumn("usuario", "background_url")
  }
};
