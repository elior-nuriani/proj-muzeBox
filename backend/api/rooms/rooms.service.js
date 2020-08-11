
const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    getById,
    add,
    remove,
    update
}

async function query() {
    const collection = await dbService.getCollection('rooms');
    try {
        var rooms = await collection.find().toArray();
        return rooms;
    }
    catch (err) {
        console.log('Error At Query Function', err)
        throw err;
    }
}

async function getById(id) {
    const collection = await dbService.getCollection('rooms');
    try {
        const room = await collection.findOne({ "_id": ObjectId(id) })
        return room;
    } catch (err) {
        console.log('Error At getById Function', err);
        throw err;
    }
}

async function remove(id) {
    const collection = await dbService.getCollection('rooms');
    try {
        await collection.deleteOne({ "_id": ObjectId(id) });
        return;

    } catch (err) {
        console.log('Error At remove Function', err);
        throw err;
    }
}

async function update(room) {
    const collection = await dbService.getCollection('rooms');
    room._id = ObjectId(room._id);

    try {
        await collection.replaceOne({ "_id": room._id }, { $set: room });
        return room;
    }catch(err){
        console.log('Error At Update Function ',err);
        throw err;
    }
}

async function add(room){
    const collection = await dbService.getCollection('rooms');
    room.rating = 0;
    room.views = 0;
    room.memebersId = [];
    room.playlist = [];

    try{
        await collection.insertOne(room);
        return room;
    }catch(err){
        console.log('Error At Add Function',err);
        throw err;
    }
}
