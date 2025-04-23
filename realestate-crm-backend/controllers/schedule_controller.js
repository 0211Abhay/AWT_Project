const { Schedule, Property, Client, Broker } = require('../models');

// Get all schedules with related data
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ],
            order: [['date', 'DESC'], ['time', 'ASC']]
        });
        
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Failed to fetch schedules', error: error.message });
    }
};

// Get schedule by ID
exports.getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.findByPk(id, {
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        
        res.status(200).json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ message: 'Failed to fetch schedule', error: error.message });
    }
};

// Create new schedule
exports.createSchedule = async (req, res) => {
    try {
        const { property_id, client_id, broker_id, description, date, time, status } = req.body;
        
        // Validate required fields
        if (!property_id || !client_id || !broker_id || !date || !time) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Create new schedule
        const newSchedule = await Schedule.create({
            property_id,
            client_id,
            broker_id,
            description,
            date,
            time,
            status: status || 'Pending'
        });
        
        // Fetch the created schedule with related data
        const createdSchedule = await Schedule.findByPk(newSchedule.schedule_id, {
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        res.status(201).json(createdSchedule);
    } catch (error) {
        console.error('Error creating schedule:', error);
        res.status(500).json({ message: 'Failed to create schedule', error: error.message });
    }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, client_id, broker_id, description, date, time, status } = req.body;
        
        // Find the schedule
        const schedule = await Schedule.findByPk(id);
        
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        
        // Update schedule
        await schedule.update({
            property_id: property_id || schedule.property_id,
            client_id: client_id || schedule.client_id,
            broker_id: broker_id || schedule.broker_id,
            description: description !== undefined ? description : schedule.description,
            date: date || schedule.date,
            time: time || schedule.time,
            status: status || schedule.status
        });
        
        // Fetch the updated schedule with related data
        const updatedSchedule = await Schedule.findByPk(id, {
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        res.status(200).json(updatedSchedule);
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ message: 'Failed to update schedule', error: error.message });
    }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find the schedule
        const schedule = await Schedule.findByPk(id);
        
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        
        // Delete schedule
        await schedule.destroy();
        
        res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ message: 'Failed to delete schedule', error: error.message });
    }
};

// Get schedules by broker ID
exports.getSchedulesByBrokerId = async (req, res) => {
    try {
        const { brokerId } = req.params;
        
        const schedules = await Schedule.findAll({
            where: { broker_id: brokerId },
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ],
            order: [['date', 'DESC'], ['time', 'ASC']]
        });
        
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching broker schedules:', error);
        res.status(500).json({ message: 'Failed to fetch broker schedules', error: error.message });
    }
};

// Get schedules by client ID
exports.getSchedulesByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;
        
        const schedules = await Schedule.findAll({
            where: { client_id: clientId },
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ],
            order: [['date', 'DESC'], ['time', 'ASC']]
        });
        
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching client schedules:', error);
        res.status(500).json({ message: 'Failed to fetch client schedules', error: error.message });
    }
};

// Update schedule status
exports.updateScheduleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status || !['Pending', 'Completed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        
        // Find the schedule
        const schedule = await Schedule.findByPk(id);
        
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found' });
        }
        
        // Update status
        await schedule.update({ status });
        
        // Fetch the updated schedule with related data
        const updatedSchedule = await Schedule.findByPk(id, {
            include: [
                { model: Property, as: 'property' },
                { model: Client, as: 'client' },
                { model: Broker, as: 'broker' }
            ]
        });
        
        res.status(200).json(updatedSchedule);
    } catch (error) {
        console.error('Error updating schedule status:', error);
        res.status(500).json({ message: 'Failed to update schedule status', error: error.message });
    }
};
