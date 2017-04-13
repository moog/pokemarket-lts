'use strict'

const controller = require('../controllers/pokemon');
const validate = require('express-validation');
const schemas = require('../validations/pokemon.js');

module.exports = (app) => {
    app.get('/pokemons', validate(schemas.getPokemons), controller.getPokemons);
    app.put('/pokemons', validate(schemas.createPokemon), controller.createPokemon);
    app.post('/pokemons/buy', validate(schemas.buyPokemon), controller.buyPokemon)
}




