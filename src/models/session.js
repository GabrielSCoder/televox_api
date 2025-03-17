'use strict';
const { Model } = require('sequelize');
const dotenv = require("dotenv");
const { generateHMAC } = require("../services/crypto");
dotenv.config();


module.exports = (sequelize, DataTypes) => {
    class Sessao extends Model {

        check(ip) {
            return bcrypt.compareSync(ip, this.ip_address);
        }

        static associate(models) {
            Sessao.belongsTo(models.Usuario, {
                foreignKey: 'usuario_id',
                as: 'usuario'
            })
        }
    }

    Sessao.init({
        usuario_id: DataTypes.INTEGER,
        ip_address: DataTypes.STRING,
        fingerprint_id: DataTypes.STRING,
        os_browser: DataTypes.STRING,
        data_login: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Sessao',
        tableName: 'sessao',
        timestamps: false,
        hooks: {
            beforeCreate: async (session) => {
                console.log("HMAC inicial:", session.ip_address);
                session.ip_address = await generateHMAC(session.ip_address, process.env.HMAC_SECRET)
                console.log("HMAC final:", session.ip_address);
            },
            beforeUpdate: async (session) => {
                if (session.changed("ip_address")) {
                    session.ip_address = await generateHMAC(session.ip_address, process.env.HMAC_SECRET)
                }
            }
        }
    });
    return Sessao;
};