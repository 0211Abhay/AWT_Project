const { Property } = require('../models');

exports.createProperty = async (req, res) => {
    try {
        const { broker_id, name, location, price, property_for, property_type, bedrooms, bathrooms, area, contact_agent, year_built, status, description, amenities, images } = req.body;

        // Process amenities to ensure it's a proper array
        const processedAmenities = typeof amenities === 'string' ?
            (amenities.startsWith('[') ? JSON.parse(amenities) : [amenities]) :
            amenities;

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
            amenities: processedAmenities,
            images
        });

        res.status(201).json({ message: 'Property created successfully', property });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(400).json({ error: error.message });
    }
};
exports.getPropertyById = async (req, res) => {
    try {
        const { property_id } = req.params;
        const property = await Property.findByPk(property_id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.status(200).json({ message: 'Property fetched successfully', property });
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: error.message });
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
exports.updateProperty = async (req, res) => {
    try {
        const { property_id } = req.params;
        const { broker_id, name, location, price, property_for, property_type, bedrooms, bathrooms, area, contact_agent, year_built, status, description, amenities, images } = req.body;

        const property = await Property.findByPk(property_id);

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Process amenities to ensure it's a proper array
        const processedAmenities = typeof amenities === 'string' ?
            (amenities.startsWith('[') ? JSON.parse(amenities) : [amenities]) :
            amenities;

        await property.update({
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
            amenities: processedAmenities,
            images
        });

        res.status(200).json({ message: 'Property updated successfully', property });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.deleteProperty = async (req, res) => {
    try {
        const { property_id } = req.params;
        const deleted = await Property.destroy({ where: { property_id } });
        if (!deleted) {
            return res.status(404).json({ error: 'Property not found' });
        }
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPropertiesByBroker = async (req, res) => {
    try {
        const properties = await Property.findAll({ where: { broker_id: req.params.broker_id } });
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
