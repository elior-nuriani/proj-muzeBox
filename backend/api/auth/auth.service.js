const userService = require('../users/users.service');
const msg = 'Email or Password Invalid'

async function login(email, password) {
    email = email.toLowerCase();

    if (!email || !password) return Promise.reject(msg);
    const user = await userService.getByEmail(email);
    if (!user) return Promise.reject(msg);
    const match = (user.password === password) ? true : false;
    if (!match) return Promise.reject(msg);

    return user;
}

//Username = firstname and lastname!
async function signup(userCred) {
    for(let info in userCred ){
        if(!userCred[info]) return Promise.reject('Missing Details'); 
    }

    //Default Initizialize
    userCred.email = userCred.email.toLowerCase();
    userCred.rating = 0;
    userCred.motto = '';
    userCred.ratedRoomsId = [];

    const user = await userService.add(userCred);
    return user;
}

module.exports = {
    signup,
    login
}