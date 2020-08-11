module.exports = {
    getRooms,
    getRoom,
    addRoom,
    updateRoom,
    removeRoom
}

const roomService = require('./rooms.service');

async function getRooms(req,res){
    const rooms = await roomService.query();
    res.send(rooms);
}

async function getRoom(req,res){
    const id = req.params.id;
    const room = await roomService.getById(id);
    res.send(room);
}

async function addRoom(req,res){
    const newRoom = req.body;
    const room = await roomService.add(newRoom);
    res.send(room);
}

async function updateRoom(req,res){
    const updatedRoom = req.body;
    const room = await roomService.update(updatedRoom);
    res.send(room);
}

async function removeRoom(req,res){
    const id = req.params.id;
    await roomService.remove(id);
    res.send();
}

