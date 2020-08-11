async function requireAuth(req,res, next){
    if(!req.session.user || !req.session ){
        res.status(401).end('Access Denied!')
        return;
    }
    next();

}

module.exports = {
    requireAuth
}