'use strict'

const pagarme = require('pagarme');

class Pagarme {
    constructor() { }

    get maxAmount() {
        return 2147483647;
    }

    isValidAmount(value) {
        return value <= this.maxAmount;
    }

    get paymentMethods() {
        return {
            CREDIT_CARD: 'credit_card'
        }
    }   

    get transactionStatus() {
        return {
            PAID: 'paid'
        }
    }  

    transaction(info) {
        let paymentInfo = {
            amount: info.amount, 
            payment_method: info.paymentMethod,
            metadata: info.metadata
        };

        if (info.paymentMethod === this.paymentMethods.CREDIT_CARD) {
            const cardInfo = {
                card_number: info.card.number,
                card_expiration_date: info.card.expirationDate,
                card_holder_name: info.card.holderName,
                card_cvv: info.card.cvv
            }

            paymentInfo = Object.assign(paymentInfo, cardInfo);
        } 

        return pagarme.client.connect({ 
                api_key: process.env.PAGARME_APIKEY 
            })
            .then((client) => {
                return client.transactions.create(paymentInfo);
            });
    } 
};

module.exports = Pagarme;