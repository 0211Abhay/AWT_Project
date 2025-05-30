const express = require('express');
const router = express.Router();
const {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getPropertiesByBroker
} = require('../controller/property_controller');

router.post('/createProperty', createProperty);
router.get('/getAllProperty', getAllProperties);
router.get('/getOneProperty/:property_id', getPropertyById);
router.put('/updateProperty/:property_id', updateProperty);
router.delete('/deleteProperty/:property_id', deleteProperty);
router.get('/getPropertiesByBroker/:broker_id', getPropertiesByBroker)
module.exports = router;