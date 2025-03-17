'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeColumn("sessao", "dispositivo_id")
    await queryInterface.addColumn("sessao", "ip_address", { type: Sequelize.STRING, allowNull: false })
    await queryInterface.addColumn("sessao", "fingerprint_id", { type: Sequelize.STRING, allowNull: false })
    await queryInterface.addColumn("sessao", "os_browser", { type: Sequelize.STRING, allowNull: false })
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.addColumn("sessao", "dispositivo_id", { type: Sequelize.STRING, allowNull: false })
    await queryInterface.removeColumn("sessao", "ip_address")
    await queryInterface.removeColumn("sessao", "fingerprint_id")
    await queryInterface.removeColumn("sessao", "os_browser")
  }
};
