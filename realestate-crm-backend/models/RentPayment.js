const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RentPayment = sequelize.define('rent_payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rental_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rentals',
            key: 'rental_id'
        }
    },
    month: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    amount_due: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'rent_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

    return RentPayment;
};
