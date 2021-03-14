//imports
const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const {graphqlHTTP} = require('express-graphql');
const bookSchema = require('./schema');
const resolvers = require('./resolver');

mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true,
    useUnifiedTopology: true,
    },  
    () => console.log("Connected to DB")
    );

//initialize express

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: bookSchema,
    graphiql: true,
    rootValue: resolvers
}));

app.listen(3000, () => console.log('GraphQL is running on http://localhost:3000/graphql'));
