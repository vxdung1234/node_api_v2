const allowedOrigins = require('../config/allowedOrigins');

const credential = (req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', true);
    }
    next();
};

module.exports = credential;