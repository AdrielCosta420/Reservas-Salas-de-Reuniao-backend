const express = require('express');

const router = express.Router();
const { createMeetingRoom, getAllRooms, reserveRoom, updateRoom, cancelRoom } = require('../controllers/MeetingRoomsController');

router.post('/', createMeetingRoom);
router.get('/', getAllRooms);
router.post('/:id/reserve', reserveRoom);
router.put('/:id', updateRoom);
router.put('/:id/cancel', cancelRoom);

module.exports = router;