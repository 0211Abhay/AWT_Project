const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Broker = require('./broker');

const Client = sequelize.define('Client', {
    clientId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    brokerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Brokers', key: 'broker_id' }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(15)
    },
    address: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'Clients',
    timestamps: true,
});

Client.belongsTo(Broker, { foreignKey: 'brokerId' });

module.exports = Client;
