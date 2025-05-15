const express = require('express');
const router = express.Router();
const { addRentPayment, getRentalPayments, getAllPaidPayments } = require('../controller/rent_payment_controller');

// Add a new rent payment
router.post('/addRentPayment', addRentPayment);

// Get payments for a specific rental
router.get('/getRentalPayments/:rental_id', getRentalPayments);

// Get all paid payments by broker ID
router.get('/getAllPaidPayments/:broker_id', getAllPaidPayments);

// Legacy route (deprecated)
router.get('/getAllPaidPayments', (req, res) => {
    res.status(400).json({ error: 'This endpoint is deprecated. Please use /getAllPaidPayments/:broker_id instead' });
});

module.exports = router;
