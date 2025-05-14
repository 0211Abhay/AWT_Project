const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Rental = sequelize.define("Rental", {
        rental_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "clients", // Table name
                key: "client_id",
            },
            onDelete: "CASCADE",
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
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        rent_amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Active', 'Completed', 'Terminated'),
            allowNull: false,
            defaultValue: 'Active',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'rental_management',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    });

    return Rental;
};
