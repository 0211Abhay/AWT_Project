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
const Property = require('./Property')(sequelize);
const Schedule = require('./schedule')(sequelize);
// Define associations
Broker.hasMany(Client, { foreignKey: 'broker_id' });
Client.belongsTo(Broker, { foreignKey: 'broker_id' });

// Set up Schedule associations
Property.hasMany(Schedule, { foreignKey: 'property_id', as: 'schedules' });
Schedule.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

Client.hasMany(Schedule, { foreignKey: 'client_id', as: 'schedules' });
Schedule.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

Broker.hasMany(Schedule, { foreignKey: 'broker_id', as: 'schedules' });
Schedule.belongsTo(Broker, { foreignKey: 'broker_id', as: 'broker' });

const db = {
    sequelize,
    Sequelize,
    Broker,
    Client,
    Property,
    Schedule
};

module.exports = db;
