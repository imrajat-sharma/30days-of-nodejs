const path = require('path');
const adminMiddleware = (req, res, next) => {
    const {username} = req.query;
    if(username && username.toLowerCase() === 'admin'){
        next();
    } else {
        res.status(403).send('<h2>Access Denied</h2><p>You do not have permission to access this page.</p>');
    }
}
module.exports = adminMiddleware;