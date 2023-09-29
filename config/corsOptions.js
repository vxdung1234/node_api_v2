const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, cb) => {
        if(allowedOrigins.includes(origin) || !origin) {
            cb(null, origin);
        } else {
            cb(new Error(`${origin} is not allowed by CORS`));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;