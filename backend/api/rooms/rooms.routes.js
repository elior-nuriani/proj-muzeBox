const express = require('express');
const router = express.Router();
const { getRooms, getRoom, addRoom, updateRoom, removeRoom } = require('./rooms.controller')

router.get('/', getRooms);
router.get('/:id', getRoom);
router.post('/', addRoom);
router.put('/', updateRoom);
router.delete('/:id', removeRoom)

module.exports = router;