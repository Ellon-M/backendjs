//express server

const express = require("express");
const {graphqlHTTP} = require('express-graphql');
const books = require('./book.js');
const authors = require('./author.js');
const app = express();

//imports from the graphQL library
 const {
      GraphQLSchema,
      GraphQLObjectType,  //for object types
      GraphQLString,
      GraphQLInt,
      GraphQLList,
      GraphQLNonNull
    } = require('graphql');

   

const BookType = new GraphQLObjectType({
   name:"Book",
   description: "Book, wriiten by an author",
   fields: () => ({
       id: { type: GraphQLNonNull(GraphQLInt)},
       name: { type: GraphQLNonNull(GraphQLString)},
       authorId: { type: GraphQLNonNull(GraphQLInt)},
       author: {type: AuthorType,
        // parent arg
    resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
    }}
   })
})

const AuthorType = new GraphQLObjectType({
    name:"Author",
    description: " This is an author of a book",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt)},
        name: { type: GraphQLNonNull(GraphQLString)},
        books : {
            type: new GraphQLList(BookType),
            resolve:(author) => {
                   return books.filter(book => book.authorId === author.id)
            }
        }
    })
 })
 
//Creating the root query
// resolve fn has to be called
const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "List of All Books",

    fields: () => ({
        book: {
            type: BookType,
            description: "A single Book",
            args: {
                id: { type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: GraphQLList(BookType),
            description: "Books List",
            resolve: () => books
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: "Authors List",
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: "A single author",
            args: {
               id : { type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
  })
})

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",

    fields: () => ({

        addBook: {
        type: BookType,
        description: "Add A Book",
        args: {
            name: { type: GraphQLNonNull(GraphQLString)},
            authorId: { type: GraphQLNonNull(GraphQLInt)},
        },
        resolve: (parent, args) => {
          const book = {id: books.length + 1, name: args.name, authorId: args.authorId }
           books.push(book);
           return book;
        }
     }, 
        addAuthor: {
            type: AuthorType,
            description: "Add An Author",
            args: {
            name: { type: GraphQLNonNull(GraphQLString)},
        },
        resolve: (parent, args) => {
          const author = {id: authors.length + 1, name: args.name}
           authors.push(authors);
           return author;
        }
    }


    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})


//UI to access the gql server
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(5000, () => console.log("Server is running!"))