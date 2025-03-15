'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {

        static associate(models) {
            Notification.belongsTo(models.Usuario, {
                foreignKey: 'usuario_id',
                as: 'usuario'
            })

            Notification.belongsTo(models.Usuario, {
                foreignKey: 'usuario_destino',
                as: 'usuario_destinoo'
            })

            Notification.belongsTo(models.Post, {
                foreignKey: 'post_id',
                as: 'post'
            })

        }
    }

    Notification.init({
        tipo: DataTypes.TEXT,
        usuario_id: DataTypes.INTEGER,
        usuario_destino: DataTypes.INTEGER,
        post_id : DataTypes.INTEGER,
        visualizado : DataTypes.BOOLEAN,
        data_criacao: DataTypes.DATE,
        data_modificao: DataTypes.DATE

    }, {
        sequelize,
        modelName: 'Notificacao',
        tableName: 'notificacao',
        timestamps: false
    });
    return Notification;
};