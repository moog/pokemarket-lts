'use strict'

const Joi = require('joi');

const getPokemons = { };

const createPokemon = {
    body: {
        name: Joi.string().min(2).max(12).required(),
        price: Joi.number().integer().positive().max(2147483647).required(),
        stock: Joi.number().integer().positive().max(9999).required()
    }
};

const buyPokemon = {
    body: {
        uuid: Joi.string().guid({ version: ['uuidv4'] }).required(),
        quantity: Joi.number().positive().integer().max(9999).required()
    }
};

module.exports = {
    getPokemons,
    createPokemon,
    buyPokemon
};

