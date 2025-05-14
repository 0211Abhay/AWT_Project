const express = require('express');
const router = express.Router();
const {
    createRental,
    getRentalById,
    getAllRentals,
    getRentalsByBroker,
    getRentalsByClient,
    getRentalsByProperty,
    updateRental,
    deleteRental,
    changeRentalStatus
} = require('../controller/rental_controller');

// Create a new rental agreement
router.post('/createRental', createRental);

// Get all rental agreements
router.get('/getAllRentals', getAllRentals);

// Get a specific rental agreement by ID
router.get('/getRental/:rental_id', getRentalById);

// Get rentals by broker ID
router.get('/getRentalsByBroker/:broker_id', getRentalsByBroker);

// Get rentals by client ID
router.get('/getRentalsByClient/:client_id', getRentalsByClient);

// Get rentals by property ID
router.get('/getRentalsByProperty/:property_id', getRentalsByProperty);

// Update a rental agreement
router.put('/updateRental/:rental_id', updateRental);

// Delete a rental agreement
router.delete('/deleteRental/:rental_id', deleteRental);

// Change rental status (Active, Completed, Terminated)
router.patch('/changeRentalStatus/:rental_id', changeRentalStatus);

module.exports = router;
