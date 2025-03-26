const { Sequelize } = require('sequelize');
const config = require('../config/db');

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect
    }
);

const Broker = require('./broker')(sequelize);
const Client = require('./clients_model')(sequelize);

// Define associations
Broker.hasMany(Client, { foreignKey: 'broker_id' });
Client.belongsTo(Broker, { foreignKey: 'broker_id' });

const db = {
    sequelize,
    Sequelize,
    Broker,
    Client
};

module.exports = db;
