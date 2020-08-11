const express = require('express');
var router = express.Router();
const { getUsers, getUser, addUser, removeUser, updateUser } = require('./users.controller');


router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', addUser);
router.delete('/:id', removeUser)
router.put('/', updateUser);


module.exports = router;