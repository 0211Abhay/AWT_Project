const { Property } = require('../models');

exports.createProperty = async (req, res) => {
    try {
        const { broker_id, name, location, price, property_for, property_type, bedrooms, bathrooms, area, contact_agent, year_built, status, description, amenities, images } = req.body;

        const property = await Property.create({
            broker_id,
            name,
            location,
            price,
            property_for,
            property_type,
            bedrooms,
            bathrooms,
            area,
            contact_agent,
            year_built,
            status,
            description,
            amenities,
            images
        });

        res.status(201).json({ message: 'Property created successfully', property });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.findAll();
        res.status(200).json({ message: 'Properties fetched successfully', properties });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: error.message });
    }
};