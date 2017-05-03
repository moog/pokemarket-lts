'use strict'

const Promise = require('bluebird');
const Pokemon = require('../models/pokemon');
const Pagarme = require('../services/pagarme');
const sequelize = require('../config/db.js');
const errors = require('../utils/errors.js')

function getPokemons (req, res) {

    Pokemon.findAll()
        .then((pokemons) => {
            return res.json({ error: errors.NO_ERROR, pokemons });
        })
        .catch((err) => {
            return res.status(400).json({ 
                error: errors.TRY_AGAIN, 
                message: 'Oops, try again later!' 
            });
        }); 

};

function createPokemon (req, res) {

    Pokemon.create(req.body)
        .then((pokemon) => {
            return res.json({ error: errors.NO_ERROR, pokemon });
        })
        .catch((err) => {
            return res.status(400).json({ 
                error: errors.TRY_AGAIN, 
                message: 'Oops, try again later!' 
            });
        })  

};

function buyPokemon (req, res) {  

    const pagarme = new Pagarme();

    let transaction = null;
    let pokemon = null;
    let totalAmount = null; 

    Promise.props({
            transaction: sequelize.transaction(),
            pokemon: Pokemon.findOne({ where: { uuid: req.body.uuid } })
        })
        .then((pokemonTransaction) => {            
            transaction = pokemonTransaction.transaction;
            pokemon = pokemonTransaction.pokemon;

            if (!pokemon) {
                return Promise.reject({ 
                    status: 404,
                    error: errors.POKEMON_NONEXISTENT,
                    message: 'This Pokemon not exist.'
                });           
            }

            // Calcuate and validate amount  
            totalAmount = req.body.quantity * pokemon.price
            if(!pagarme.isValidAmount(totalAmount)) {  
                return Promise.reject({ 
                    status: 400,
                    error: errors.EXPENSIVE, 
                    message: 'The total amount of this purchase is too much high. Please, be most humble. :p' 
                });    
            }

            // Verify if the quantity is on stock
            if (pokemon.stock < req.body.quantity) {  
                return Promise.reject({ 
                    status: 400,
                    error: errors.OUT_STOCK, 
                    message: `We only have ${pokemon.stock} ${pokemon.name} in stock.` 
                });   
            }

            return pokemon.decrement('stock', { by: req.body.quantity, transaction });
        })
        .then(() => {
            // Update model
            return pokemon.reload();
        })
        .then(() => {    
            const transactionInfo = {
                amount: totalAmount,
                paymentMethod: pagarme.paymentMethods.CREDIT_CARD,
                card: {
                    number: '4024007138010896',
                    expirationDate: '1050',
                    holderName: 'Ash Ketchum',
                    cvv: '123'
                },
                metadata: {
                    product: 'pokemon',
                    name: pokemon.name,
                    quantity: req.body.quantity
                }
            }

            return pagarme.transaction(transactionInfo);
        })
        .then((pagarmeTransaction) => {        
            if (pagarmeTransaction.status == pagarme.transactionStatus.PAID) {
                return Promise.props({
                    commit: transaction.commit(),
                    pagarmeTransaction
                });
            } else {
                return Promise.reject(pagarmeTransaction);
            }
        })
        .then(({ pagarmeTransaction }) => {
            return res.json({ 
                error: errors.NO_ERROR,
                transactionStatus: pagarmeTransaction.status
            });
        })
        .catch((err) => {
            transaction.rollback();

            if (err.status >= 400) {
                return res.status(err.status).json({ error: err.error, message: err.message });
            } else {
                return res.status(400).json({
                    error: errors.PURCHASE_FAILED,
                    message: 'The purchase failed, try again latter.'
                });
            }
        });
};

module.exports = { 
    getPokemons, 
    createPokemon, 
    buyPokemon
};