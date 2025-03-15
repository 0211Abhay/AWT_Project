const sequelize = require('../config/db');
const Client = require('./client');

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true }); // Use 'alter' for safe schema updates
        console.log('All tables synchronized successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = { Client, syncDB };
