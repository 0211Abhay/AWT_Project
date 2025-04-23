const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule_controller');

// Get all schedules
router.get('/', scheduleController.getAllSchedules);

// Get schedule by ID
router.get('/:id', scheduleController.getScheduleById);

// Create new schedule
router.post('/', scheduleController.createSchedule);

// Update schedule
router.put('/:id', scheduleController.updateSchedule);

// Delete schedule
router.delete('/:id', scheduleController.deleteSchedule);

// Get schedules by broker ID
router.get('/broker/:brokerId', scheduleController.getSchedulesByBrokerId);

// Get schedules by client ID
router.get('/client/:clientId', scheduleController.getSchedulesByClientId);

// Update schedule status
router.patch('/:id/status', scheduleController.updateScheduleStatus);

module.exports = router;
