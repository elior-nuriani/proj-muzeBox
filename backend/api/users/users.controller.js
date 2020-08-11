const userService = require('./users.service');
const { add } = require('./users.service');

async function getUsers(req,res){
    const users = await userService.query();
    res.send(users);
}

async function getUser(req,res){
    const id = req.params.id;
    const user = await userService.getById(id);
    res.send(user);
}

async function addUser(req,res){
    const newUser = req.body;
    const user = await userService.add(newUser);
    res.send(user);
}

async function removeUser(req,res){
    const id = req.params.id;
    await userService.remove(id);
    res.send();
}
async function updateUser(req,res){
    const user = req.body;
    const updatedUser = await userService.update(user);
    res.send(updatedUser);
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    removeUser,
    updateUser
}