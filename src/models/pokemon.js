'use strict'

const Sequelize = require('sequelize');
const connection = require('../config/db');

const PokemonSchema = connection.define('pokemon', {
	uuid: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			min: 2,
			max: 12
		}
	},
	price: {
		type: Sequelize.INTEGER(10),
		allowNull: false,
		default: 0
	},
	stock: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	}
});

PokemonSchema.sync();

module.exports = PokemonSchema;