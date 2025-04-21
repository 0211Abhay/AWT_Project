const { Client, Broker } = require('../models');

// Create a new client
exports.createClient = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { broker_id, name, email, phone, address } = req.body;

        const client = await Client.create({ broker_id, name, email, phone, address });

        res.status(201).json({ message: "Client created successfully", client });
    } catch (error) {
        console.error("Error creating client:", error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.findAll();
        console.log('Fetched clients:', clients); // Debug log
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
};


// Get a single client by ID
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: "Client fetched successfully", client });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a client
exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        await client.update(req.body);
        res.status(200).json({ message: "Client updated successfully", client });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a client
exports.deleteClient = async (req, res) => {
    try {
        const deleted = await Client.destroy({ where: { client_id: req.params.id } });
        if (!deleted) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get client name by ID
exports.getClientNameById = async (req, res) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ clientName: client.name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

