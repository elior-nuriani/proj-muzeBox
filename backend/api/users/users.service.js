const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    query,
    update,
    getById,
    remove,
    add,
    getByEmail
}

async function query() {
    const collection = await dbService.getCollection('users');
    try {
        const users = await collection.find().toArray();
        return users;

    } catch (err) {
        console.log('Error At Query Function Users', err);
        throw err;
    }
}


async function getById(id) {
    const collection = await dbService.getCollection('users');
    try {
        const user = await dbService.findOne({ "_id": `${id}` });
        return user;
    } catch (err) {
        console.log('Error At getById Function Users', err);
        throw err;
    }
}

async function getByEmail(email) {
    const collection = await dbService.getCollection('users');
    try {
        const user = await collection.findOne({ "email": `${email}` })
        return user;
    } catch (err) {
        console.log('Error At getByEmail Function Users', err);
        throw err;
    }
}

async function add(newUser) {
    const collection = await dbService.getCollection('users');
    try {
        await collection.insertOne(newUser);
        return newUser;
    } catch (err) {
        console.log('Error At Add Function Users', err);
        throw err;
    }
}

async function remove(id) {
    const collection = await dbService.getCollection('users');
    try {
        await collection.deleteOne({ "_id": `${id}` });
        return;
    } catch (err) {
        console.log('Error At Remove Function Users', err);
        throw err;
    }
}

async function update(newUser) {
    const collection = await dbService.getCollection('users');
    newUser._id = ObjectId(newUser._id)
    try {
        await collection.replaceOne({ "_id": newUser._id }, { $set: newUser })
        return newUser;
    } catch (err) {
        console.log('Error At Update Function Users', err);
        throw err;
    }
}