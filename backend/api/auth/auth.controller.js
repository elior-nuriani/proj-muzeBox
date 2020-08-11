const authService = require('./auth.service');

async function doLogin(req, res) {
    const { email, password } = req.body;
    try {
        const user = await authService.login(email, password);
        if (user) {
            req.session.user = user;
        }
        res.send(user);
    } catch (err) {
        res.status(500).send({ err })
    }
}

async function doLogout(req, res) {
    try {
        req.session.destroy();
        console.log('User Logged Out!',req.session)
        res.send()
    } catch (err) {
        res.status(500).send({ err })
    }
}


async function doSignup(req, res) {
    const userCred = req.body;
    try {
        const user = await authService.signup(userCred);
        // await authService.login(email,password);
        // req.session.user = user;
        // req.session.save();
        res.json(user)
    } catch (err) {
        res.status(500).send({ err })
    }
}


module.exports = {
    doSignup,
    doLogin,
    doLogout
}