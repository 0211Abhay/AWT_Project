
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Property = sequelize.define("Property", {
        property_id: {
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
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        property_for: {
            type: DataTypes.ENUM('Rent', 'Sale'),
            allowNull: false,
        },
        bedrooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        bathrooms: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        area: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        property_type: {
            type: DataTypes.ENUM('House', 'Apartment', 'Condo', 'Villa', 'Commercial', 'Land'),
            allowNull: true,
        },
        contact_agent: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        year_built: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Available', 'Sold', 'Rented', 'Under Negotiation'),
            allowNull: false,
            defaultValue: 'Available',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        amenities: {
            type: DataTypes.JSON,
            allowNull: true,
        },

    }, {
        tableName: 'properties',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    });

    return Property;
};