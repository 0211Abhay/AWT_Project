const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Broker = sequelize.define("Broker", {
        broker_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'brokers',
        timestamps: true
    });

    return Broker;
};
