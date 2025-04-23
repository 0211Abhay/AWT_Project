const express = require('express');
const router = express.Router();
const {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
    getClientNameById
} = require('../controller/client_controller');

router.post('/createClient', createClient);
router.get('/getAllClient', getAllClients);
router.get('/getOneClient/:id', getClientById);
router.get('/getClientName/:id', getClientNameById);
router.put('/updateClient/:id', updateClient);
router.delete('/deleteClient/:id', deleteClient);

module.exports = router;
