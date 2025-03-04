'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("post", "parent_id", {type : Sequelize.DataTypes.INTEGER, allowNull : true, references : {model : "post", key : "id"}, onDelete : "CASCADE"})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("post", "parent_id")
  }
};
