const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');
const Broker = require('./Broker');


module.exports = (sequelize) => {
    const Client = sequelize.define("Client", {
        client_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        broker_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "brokers",
                key: "broker_id",
            },
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'clients',
        timestamps: true, // Includes createdAt and updatedAt by default
        createdAt: 'created_at',
        updatedAt: false, // Since the SQL table doesn't have updated_at
    });

    return Client;
};
