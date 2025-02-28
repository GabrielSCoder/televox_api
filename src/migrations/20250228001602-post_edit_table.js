'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("post", "reacao_gostei")
    await queryInterface.removeColumn("post", "reacao_nao_gostei")
    await queryInterface.removeColumn("post", "qtd_comentarios")
    await queryInterface.removeColumn("post", "qt_compartilhamentos")
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("post", "reacao_gostei", {type : Sequelize.DataTypes.INTEGER})
    await queryInterface.addColumn("post", "reacao_nao_gostei", {type : Sequelize.DataTypes.INTEGER})
    await queryInterface.addColumn("post", "qtd_comentarios", {type : Sequelize.DataTypes.INTEGER})
    await queryInterface.addColumn("post", "qtd_compartilhamentos", {type : Sequelize.DataTypes.INTEGER})
  }
};
