const { Sequelize } = require('sequelize');
const config = require('../config/db');
require('dotenv');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        dialect: 'mysql',                // ← this is mandatory
        logging: console.log,
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(path.resolve(__dirname, '../sert/ca2.pem')),
                rejectUnauthorized: false
            },
            connectTimeout: 120000
        },
        pool: { max: 3, min: 0, idle: 30000 }
    }
);

const Broker = require('./Broker')(sequelize);
const Client = require('./clients_model')(sequelize);
const Property = require('./property')(sequelize);
const Schedule = require('./schedule')(sequelize);
const Rental = require('./rental')(sequelize);
const RentPayment = require('./RentPayment')(sequelize);
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

// Set up Rental associations
Broker.hasMany(Rental, { foreignKey: 'broker_id', as: 'rentals' });
Rental.belongsTo(Broker, { foreignKey: 'broker_id', as: 'broker' });

Client.hasMany(Rental, { foreignKey: 'client_id', as: 'rentals' });
Rental.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

Property.hasMany(Rental, { foreignKey: 'property_id', as: 'rentals' });
Rental.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

// Set up RentPayment associations
Rental.hasMany(RentPayment, { foreignKey: 'rental_id', as: 'payments' });
RentPayment.belongsTo(Rental, { foreignKey: 'rental_id', as: 'rental' });

const db = {
    sequelize,
    Sequelize,
    Broker,
    Client,
    Property,
    Schedule,
    Rental,
    RentPayment
};

module.exports = db;
