//GraphQL - a query language for APIs that describes how to ask & fetch the data from the server to the client

//imports
const {graphql, buildSchema} = require("graphql");

//initialize a GraphQL schema
//the Query in GraphQL is an object that represents some data
const schema = buildSchema(`
type Query{
    foo: String
  }
`)

//Root resolver

//A function that populates a field in a schema
//Any field in the Query object in the schema could contain any type of data
//The function returns a response wrt the data given
const root = {foo: () => 'GQL Server'};

graphql(schema, '{foo}', root).then(res => console.log(res));

