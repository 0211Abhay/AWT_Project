const express = require('express');
const router = express.Router();
const { addRentPayment, getRentalPayments, getAllPaidPayments } = require('../controller/rent_payment_controller');

// Add a new rent payment
router.post('/addRentPayment', addRentPayment);

// Get payments for a specific rental
router.get('/getRentalPayments/:rental_id', getRentalPayments);

// Get all paid payments
router.get('/getAllPaidPayments', getAllPaidPayments);

module.exports = router;
