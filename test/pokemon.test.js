'use strict'

const app = require('../src/index.js');
const request = require('supertest')(app);
const Pagarme = require('../src/services/pagarme.js');
const errors = require('../src/utils/errors.js');
const pagarme = new Pagarme();

const model = { name: 'Charizard', price: 214792, stock: 9999 };
let buyModel = { quantity: 5 };
let buyExpensiveModel = { quantity: 9999 };
let buyOutStockModel = { quantity: 9996 };
let buyNonexistentModel = { uuid: '9afc8409-2890-4e3f-b365-deaaf2b28e01', quantity: 1 };

describe('PokeMarket', () => {
    
    it('should create a pokemon', () => {
        request
            .put('/pokemons')
            .send(model)
            .expect(200)
            .then(({ body }) => {        
                expect(body.error).toBe(errors.NO_ERROR);
                expect(body.pokemon).toBeDefined();
                expect(body.pokemon.uuid).toBeDefined();

                buyModel.uuid = body.pokemon.uuid;
                buyExpensiveModel.uuid = body.pokemon.uuid;
                buyOutStockModel.uuid = body.pokemon.uuid;
            });
    });
    
    it('should get all pokemons', () => {
        request
            .get('/pokemons')
            .expect(200)            
            .then(({ body }) => {        
                expect(body.error).toBe(errors.NO_ERROR);
                expect(body.pokemons).toBeDefined();
                expect(Array.isArray(body.pokemons)).toBeTruthy();
                expect(body.pokemons.length).toBeGreaterThan(0);
            });
    });
    
    it(`should not be able to make a purchase priced above ${pagarme.maxAmount}`, () => {
        request
            .post('/pokemons/buy')
            .send(buyExpensiveModel)
            .expect(400)         
            .then(({ body }) => {        
                expect(body.error).toBe(errors.EXPENSIVE);
            });
    });
    
    it('should buy a pokemon', () => {
        request
            .post('/pokemons/buy')
            .send(buyModel)
            .expect(200)         
            .then(({ body }) => {        
                expect(body.error).toBe(errors.NO_ERROR);
                expect(body.transactionStatus).toBe('paid');
            });
    });
    
    it('should not buy a pokemon out stock', () => {
        request
            .post('/pokemons/buy')
            .send(buyOutStockModel)
            .expect(400)        
            .then(({ body }) => {        
                expect(body.error).toBe(errors.OUT_STOCK);
            });       
    });
    
    it('should not buy a nonexistent pokemon', () => {
        request
            .post('/pokemons/buy')
            .send(buyNonexistentModel)
            .expect(404)
            .then(({ body }) => {        
               expect(body.error).toBe(errors.POKEMON_NONEXISTENT);
            });  
    });

});
