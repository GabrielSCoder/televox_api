'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("usuario", "username", {type : Sequelize.DataTypes.STRING, allowNull : true})
  },
  async down (queryInterface) {
    await queryInterface.removeColumn("usuario", "username")
  }
};
