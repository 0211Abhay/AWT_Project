const express = require('express');
const router = express.Router();
const {
    createProperty,
    getAllProperties,
    // getPropertyById,
    // updateProperty,
    // deleteProperty
} = require('../controller/property_controller');

router.post('/createProperty', createProperty);
router.get('/getAllProperty', getAllProperties);
// router.get('/getOneProperty/:id', getPropertyById);
// router.put('/updateProperty/:id', updateProperty);
// router.delete('/deleteProperty/:id', deleteProperty);

module.exports = router;