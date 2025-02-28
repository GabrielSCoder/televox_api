'use strict';

const { query } = require('express');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("post_reaction", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuario",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      post_id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : "post",
          key : "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      data_criacao : {
        type : Sequelize.DATE,
        allowNull : false
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("post_reaction")
  }
};
