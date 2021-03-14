// store graphql queries

const {buildSchema} = require('graphql');
const bookSchema = buildSchema(`
   type Query {
       books: [Book],
       bookbyId(id: Int!): Book
   }
   
   type Mutation {
    addBook(id: Int!,name: String!, authorId: Int!): Book
   }

   type Book {
    id: ID,
    name: String,
    authorId: Int,
    author: String,
    year: String
   }

`);

module.exports = bookSchema;