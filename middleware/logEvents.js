const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const { v4: uuid } = require('uuid');
const { format } = require('date-fns');

const logEvents = async (message, filename) => {
    const dateTime = format( new Date(), 'yyyy-MM-dd\tHH:mm:ss');
    const logItem = `${uuid()}\t${dateTime}\t${message}\n`;
    try {
        const logDir = path.join(__dirname, '..', 'logs');
        if(!fs.existsSync(logDir)) {
            await fsPromise.mkdir(logDir);
        }
        await fsPromise.appendFile(path.join(logDir, filename), logItem);
    } catch (error) {
        console.log(error);
    }
};

const requireLogger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'requireLog.txt');
    next();
};

const errorLogger = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errorLog.txt');
    next();
};

module.exports = { requireLogger, errorLogger };