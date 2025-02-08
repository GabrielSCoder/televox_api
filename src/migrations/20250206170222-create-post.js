'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull : false
      },
      conteudo: {
        type: Sequelize.TEXT,
        allowNull : false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'usuario',
          key : 'id'
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },
      reacao_gostei: {
        type: Sequelize.INTEGER,
        defaultValue : 0
      },
      reacao_nao_gostei: {
        type: Sequelize.INTEGER,
        defaultValue : 0
      },
      qtd_comentarios: {
        type: Sequelize.INTEGER,
        defaultValue : 0
      },
      qt_compartilhamentos: {
        type: Sequelize.INTEGER,
        defaultValue : 0
      },
      data_criacao: {
        allowNull: false,
        type: Sequelize.DATE
      },
      data_modificao: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('post');
  }
};