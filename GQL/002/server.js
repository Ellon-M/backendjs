//using the express graphQL server


//imports
const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');

//initialize a schema
const schema = buildSchema(`
   type Query {
       coo: String
   }
`);

//Root resolver
// returns a resp
const root = {coo: () => 'Express-GQL Server'};

//initialize express

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root
}));

app.listen(3000, () => console.log('GraphQL is running on http://localhost:3000/graphql'));

