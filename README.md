<img src="https://travis-ci.org/MateusMoog/pokemarket-lts.svg?branch=master" />

# Pokemarket 

Refactoring de código para utilizar a [API](https://docs.pagar.me/) da Pagar.me

## Desafio

Basicamente é um projeto bem simples, mas com o código completamente abandonado. A idéia é entender o que este código faz para então consertar e refatorar o que achar necessário. Desde que o código atenda a funcionalidade inicial (que é extremamente básica), sinta-se livre para adicionar ou remover o que quiser dele. Note que este código contém desde pequenos erros até questões extremamente importantes que estão faltando. O objetivo final é entregar um projeto completo, seguro, pronto para produção e de fácil manutenção.

Não fique preso a apenas refatorar o código, altere o que achar necessário para deixar o projeto em um estado pronto para produção, então escolha querer evoluir o quanto quiser, mas cuidado apenas com over engineering.


## Instalação

### Instalação do Node.js 6.10.2 e do NPM

- Node.js versão 6.10.2
- Instruções de instalação [neste link](https://nodejs.org/en/download/package-manager)
- Ao final, verificar a versão de ambos para confirmar:

```bash
node -v
npm -v
```

- Recomenda-se o uso de [n](https://github.com/tj/n) para versionar diferentes versões do Node.js

### Dependências

- Instalação global do componente [PM2](pm2.keymetrics.io) 1.x
```bash
npm install -g pm2
pm2 -v
```

### Instalação do projeto

```bash
git clone https://github.com/mateusmoog/pokemarket
npm install
```

## Inicializando a aplicação

### Iniciar a aplicação para PROD

Inicializa o PM2, com a aplicação como serviço, utilizando o máximo de núcleos disponíveis, observando mudanças e atualizando, reiniciando caso ocorram falhas

```bash
export NODE_ENV=production
npm start
```

### Parar a aplicação

```bash
npm stop
```

### Iniciar a aplicação para DEV

Inicializa o PM2, com a aplicação como serviço, utilizando 1 núcleo, observando mudanças, parando a cada falha e lançando o log após a inicialização

```bash
npm run dev
```

### Logs da aplicação

```bash
npm run logs
```

### Iniciar os testes

```bash
npm test
```

## Rotas

### Listar Pokemons
```
GET http://localhost:1991/pokemons

Response
{
    error: 0,
    pokemons: [
        { 
            uuid: 'abcdef-1nas1-as1rfag',
            name: "Charizard", 
            price: 1000, 
            stock: 9999 
        }
    ]
}
```

### Criar Pokemon
```
PUT http://localhost:1991/pokemons

Request 
{ name: "Charizard", price: 1000, stock: 9999 }


Response
{
    error: 0,
    pokemon: { 
        uuid: 'abcdef-1nas1-as1rfag', 
        name: "Charizard", 
        price: 1000, 
        stock: 9999 
    }
}
```

### Comprar Pokemon
```
POST http://localhost:1991/pokemons/buy

Request
{ uuid: 'abcdef-1nas1-as1rfag', quantity: 1 }

Response
{
    error: 0,
    transactionStatus: 'paid'
}
```

## Implementações futuras
    - Filtrar, deletar, e possibilitar a compra de vários pokemons
    - Middleware de autenticação com passport e jwt
    - Middleware de autorização (admin e cliente)
    