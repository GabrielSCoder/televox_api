'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("usuario", "data_nascimento", {type : Sequelize.DataTypes.STRING, allowNull : true})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("usuario", "data_nascimento", {type : Sequelize.DataTypes.DATE, allowNull : true})
  }
};
