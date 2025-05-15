const { sequelize, RentPayment, Rental } = require('../models');
const { QueryTypes, Op } = require('sequelize');

// Add a new rent payment
const addRentPayment = async (req, res) => {
    try {
        const {
            rental_id,
            payment_date,
            amount,
            month,
            due_date,
            payment_for_month
        } = req.body;

        // Validate required fields
        if (!rental_id || !payment_date || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Format the month name if month data is available
        const formattedMonth = month || new Date(payment_date).toLocaleString('default', { month: 'long', year: 'numeric' });

        // Check for existing payment for this rental and month
        const existingPayment = await RentPayment.findOne({
            where: {
                rental_id,
                month: formattedMonth
            }
        });

        if (existingPayment) {
            return res.status(400).json({
                error: 'Duplicate payment',
                message: `A payment for ${formattedMonth} has already been recorded for this rental.`,
                details: 'Each rental period can only have one payment entry.'
            });
        }

        // Insert payment record into the database using Sequelize model
        const result = await RentPayment.create({
            rental_id,
            month: formattedMonth,
            due_date: due_date || payment_date,
            amount_due: amount,
            amount_paid: amount,
            payment_date,
            payment_for_month: payment_for_month || payment_date,
            status: 'paid',
            notes: 'Payment recorded via rental management system'
        });

        if (result) {
            return res.status(201).json({
                success: true,
                payment_id: result.payment_id,
                message: 'Payment recorded successfully'
            });
        } else {
            return res.status(500).json({ error: 'Failed to record payment' });
        }
    } catch (error) {
        console.error('Error recording payment:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Get payments for a specific rental
const getRentalPayments = async (req, res) => {
    try {
        const { rental_id } = req.params;

        const payments = await RentPayment.findAll({
            where: { rental_id },
            order: [['payment_date', 'ASC']]
        });

        return res.status(200).json({ payments });
    } catch (error) {
        console.error('Error fetching rental payments:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// Get all paid payments by broker ID
const getAllPaidPayments = async (req, res) => {
    try {
        const { broker_id } = req.params;
        console.log('Fetching paid payments for broker ID:', broker_id);

        if (!broker_id) {
            return res.status(400).json({ error: 'Broker ID is required' });
        }

        // Join RentPayment with Rental to filter by broker_id
        const payments = await RentPayment.findAll({
            where: { status: 'paid' },
            include: [{
                model: Rental,
                as: 'rental',
                where: { broker_id: broker_id },
                attributes: [] // Don't include rental data in the result
            }],
            order: [['payment_date', 'DESC']]
        });

        return res.status(200).json({ payments });
    } catch (error) {
        console.error('Error fetching paid payments:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
    }
};

module.exports = {
    addRentPayment,
    getRentalPayments,
    getAllPaidPayments
};
