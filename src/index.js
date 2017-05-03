'use strict'

if (!process.env.TRAVIS || process.env.TRAVIS == 'false') {
	require('dotenv').config();
}

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const expressLogger = require('./middlewares/expressLogger.js');
const fs = require('fs');
const helmet = require('helmet');
const log = require('./config/log.js')
const path = require('path');
const errors = require('./utils/errors.js')

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(expressLogger);

// routing
const routesPath = path.join(__dirname, 'routes');		
fs.readdirSync(routesPath).map(filename => {
	let routeFilePath = path.join(routesPath, filename);
    require(routeFilePath)(app);
});

// express error handling
app.use(function (err, req, res, next) {
	log.error(err);
	
	const errorResponse = { error: errors.REQUEST_VALIDATOR, errors: err.errors };
	res.status(err.status || 500).json(errorResponse);
})

app.listen(process.env.API_PORT, function () {
	log.info(`Listening on http://${process.env.API_ADDRESS}:${process.env.API_PORT}`);
});

module.exports = app;


