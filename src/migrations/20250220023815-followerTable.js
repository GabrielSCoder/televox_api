'use strict';

const { query } = require('express');
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("seguidor", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      follower_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "usuario",
          key: "id"
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },
      following_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "usuario",
          key: "id"
        },
        onUpdate : 'CASCADE',
        onDelete : 'CASCADE'
      },
      followedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("seguidor")
  }
};
