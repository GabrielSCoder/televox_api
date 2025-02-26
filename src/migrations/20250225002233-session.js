'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessao', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : "usuario",
          key : "id"
        },
        onUpdate : "CASCADE",
        onDelete : "CASCADE"
      },
      dispositivo_id: {
        type: Sequelize.STRING,
        allowNull : false
      },
      data_login : {
        type : Sequelize.DATE,
        allowNull : false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sessao")
  }
};
