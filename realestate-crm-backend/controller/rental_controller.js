const { Rental, Property, Client, Broker } = require('../models');
const { Op } = require('sequelize');

exports.createRental = async (req, res) => {
    try {
        const { 
            broker_id, 
            client_id, 
            property_id, 
            start_date, 
            end_date, 
            rent_amount, 
            status, 
            notes 
        } = req.body;

        // Validate required fields
        if (!broker_id || !client_id || !property_id || !start_date || !end_date || !rent_amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if property exists
        const property = await Property.findByPk(property_id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if client exists
        const client = await Client.findByPk(client_id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Check if broker exists
        const broker = await Broker.findByPk(broker_id);
        if (!broker) {
            return res.status(404).json({ error: 'Broker not found' });
        }
        
        // Check for redundancy - if the same client has already rented during the overlapping period
        const overlappingRentals = await Rental.findAll({
            where: {
                client_id,
                [Op.or]: [
                    // Case 1: New rental starts during an existing rental
                    {
                        start_date: { [Op.lte]: start_date },
                        end_date: { [Op.gte]: start_date }
                    },
                    // Case 2: New rental ends during an existing rental
                    {
                        start_date: { [Op.lte]: end_date },
                        end_date: { [Op.gte]: end_date }
                    },
                    // Case 3: New rental encompasses an existing rental
                    {
                        start_date: { [Op.gte]: start_date },
                        end_date: { [Op.lte]: end_date }
                    }
                ]
            }
        });
        
        if (overlappingRentals.length > 0) {
            return res.status(400).json({
                error: 'Redundant rental entry',
                message: 'This client already has a rental agreement that overlaps with the specified dates.',
                details: 'Please check the client\'s existing rentals and choose different dates.'
            });
        }

        // Create rental record
        const rental = await Rental.create({
            broker_id,
            client_id,
            property_id,
            start_date,
            end_date,
            rent_amount,
            status: status || 'Active',
            notes
        });

        res.status(201).json({ 
            message: 'Rental agreement created successfully', 
            rental 
        });
    } catch (error) {
        console.error('Error creating rental agreement:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getRentalById = async (req, res) => {
    try {
        const { rental_id } = req.params;
        
        const rental = await Rental.findByPk(rental_id, {
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        if (!rental) {
            return res.status(404).json({ error: 'Rental agreement not found' });
        }
        
        res.status(200).json({ 
            message: 'Rental agreement fetched successfully', 
            rental 
        });
    } catch (error) {
        console.error('Error fetching rental agreement:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllRentals = async (req, res) => {
    try {
        const rentals = await Rental.findAll({
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        res.status(200).json({ 
            message: 'Rental agreements fetched successfully', 
            rentals 
        });
    } catch (error) {
        console.error('Error fetching rental agreements:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getRentalsByBroker = async (req, res) => {
    try {
        const { broker_id } = req.params;
        
        const rentals = await Rental.findAll({
            where: { broker_id },
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        res.status(200).json({ 
            message: 'Broker rental agreements fetched successfully', 
            rentals 
        });
    } catch (error) {
        console.error('Error fetching broker rental agreements:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getRentalsByClient = async (req, res) => {
    try {
        const { client_id } = req.params;
        
        const rentals = await Rental.findAll({
            where: { client_id },
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        res.status(200).json({ 
            message: 'Client rental agreements fetched successfully', 
            rentals 
        });
    } catch (error) {
        console.error('Error fetching client rental agreements:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getRentalsByProperty = async (req, res) => {
    try {
        const { property_id } = req.params;
        
        const rentals = await Rental.findAll({
            where: { property_id },
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        res.status(200).json({ 
            message: 'Property rental agreements fetched successfully', 
            rentals 
        });
    } catch (error) {
        console.error('Error fetching property rental agreements:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateRental = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const { 
            broker_id, 
            client_id, 
            property_id, 
            start_date, 
            end_date, 
            rent_amount, 
            status, 
            notes 
        } = req.body;

        const rental = await Rental.findByPk(rental_id);
        
        if (!rental) {
            return res.status(404).json({ error: 'Rental agreement not found' });
        }

        // If updating related entities, verify they exist
        if (property_id) {
            const property = await Property.findByPk(property_id);
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }
        }

        if (client_id) {
            const client = await Client.findByPk(client_id);
            if (!client) {
                return res.status(404).json({ error: 'Client not found' });
            }
        }

        if (broker_id) {
            const broker = await Broker.findByPk(broker_id);
            if (!broker) {
                return res.status(404).json({ error: 'Broker not found' });
            }
        }

        // Update rental record
        await rental.update({
            broker_id: broker_id || rental.broker_id,
            client_id: client_id || rental.client_id,
            property_id: property_id || rental.property_id,
            start_date: start_date || rental.start_date,
            end_date: end_date || rental.end_date,
            rent_amount: rent_amount || rental.rent_amount,
            status: status || rental.status,
            notes: notes !== undefined ? notes : rental.notes
        });

        const updatedRental = await Rental.findByPk(rental_id, {
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });

        res.status(200).json({ 
            message: 'Rental agreement updated successfully', 
            rental: updatedRental 
        });
    } catch (error) {
        console.error('Error updating rental agreement:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRental = async (req, res) => {
    try {
        const { rental_id } = req.params;
        
        const deleted = await Rental.destroy({ where: { rental_id } });
        
        if (!deleted) {
            return res.status(404).json({ error: 'Rental agreement not found' });
        }
        
        res.status(200).json({ message: 'Rental agreement deleted successfully' });
    } catch (error) {
        console.error('Error deleting rental agreement:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.changeRentalStatus = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const { status } = req.body;
        
        if (!status || !['Active', 'Completed', 'Terminated'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        
        const rental = await Rental.findByPk(rental_id);
        
        if (!rental) {
            return res.status(404).json({ error: 'Rental agreement not found' });
        }
        
        await rental.update({ status });
        
        res.status(200).json({ 
            message: 'Rental status updated successfully', 
            rental 
        });
    } catch (error) {
        console.error('Error updating rental status:', error);
        res.status(500).json({ error: error.message });
    }
};
