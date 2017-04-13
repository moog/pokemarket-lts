'use strict'

const Sequelize = require('sequelize');

const options = { 
	dialect: process.env.DB_DIALECT, 
	logging: process.env.DB_LOGGING == 'true' 
};

const connection = new Sequelize(
	process.env.DB_NAME, 
	process.env.DB_USER, 
	process.env.DB_PASS, 
	options
);

module.exports = connection;