'use strict'

const fs = require('fs');
const morgan = require('morgan');
const rotatingFile = require('rotating-file-stream');

let logger = null;

if (process.env.PROD == 'false') {
    logger = morgan(':method :url :status :response-time ms - :res[content-length]');
} else {
    fs.existsSync(process.env.LOG_DIR) || fs.mkdirSync(process.env.LOG_DIR);
    
    const options = { interval: '1d', path: process.env.LOG_DIR };
    const logStream = rotatingFile('pokemarket-express.log', options); 

    logger = morgan('combined', { stream: logStream });
}

module.exports = logger;