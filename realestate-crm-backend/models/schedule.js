const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Schedule = sequelize.define("Schedule", {
        schedule_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        property_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "properties", // Table name
                key: "property_id",
            },
            onDelete: "CASCADE",
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "clients", // Table name
                key: "client_id",
            },
            onDelete: "CASCADE",
        },
        broker_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "brokers", // Table name
                key: "broker_id",
            },
            onDelete: "CASCADE",
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Pending'
        }
    });

    return Schedule;
};
