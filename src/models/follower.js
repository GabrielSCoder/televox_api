'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Follower extends Model {
        static associate(models) {
            Follower.belongsTo(models.Usuario, {
                foreignKey: 'follower_id',
                as: 'usuario_seguidor'
            })

            Follower.belongsTo(models.Usuario, {
                foreignKey: 'following_id',
                as: 'usuario_seguidores'
            })
            
        }
    }

    Follower.init({
        follower_id: DataTypes.UUID,
        following_id: DataTypes.UUID,
        followedAt: DataTypes.DATE

    }, {
        sequelize,
        modelName: 'Seguidor',
        tableName: 'seguidor',
        timestamps: false
    });
    return Follower;
};