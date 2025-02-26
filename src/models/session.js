'use strict';
const { Model } = require('sequelize');
const bcrypt = require("bcrypt")

module.exports = (sequelize, DataTypes) => {
    class Sessao extends Model {

        static associate(models) {
            Sessao.belongsTo(models.Usuario, {
                foreignKey: 'usuario_id',
                as: 'usuario'
            })
        }
    }

    Sessao.init({
        usuario_id: DataTypes.INTEGER,
        dispositivo_id: DataTypes.STRING,
        data_login: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Sessao',
        tableName: 'sessao',
        timestamps: false
    });
    return Sessao;
};