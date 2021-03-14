const Book = require('./model');

const resolvers = {
    books: () => {
        return Book.find({})
    },
    oldBooks: () => {
        return Book.find({})
    },

    bookbyId: (args) => {
        return Book.findOne({id: args.id})
    },

    addBook: (args) => {
      let book = new Book({
     id: args.id,
     name: args.name,
     authorId: args.authorId
      })
      book.save()
      return book
     }
    } 


module.exports = resolvers;