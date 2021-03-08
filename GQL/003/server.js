//using apollo server

const {ApolloServer, gql} = require('apollo-server');

// create an array of objects


const posts = [
    {
        id: 1,
        title: "Hey there!",
    },
    {
        id: 2,
        title: " Hey you!",
    }
];
const authors = [
    {
        id: 1,
        postID: 1,
        name: "Shuu"
    },
    {
        id: 1,
        postID: 2,
        name: "Coo"
    }
];
// note that the posts and the authors have a relation - in the postID
//define custom types
const schema = gql`
   type Query {
       posts: [Post],
       author: [Author]
   }

   type Post {
       id: Int,
       title: String,
       author: [Author]
   }

   type Author {
    id: Int,
    postID: Int,
    name: String
}
  `;

//Root resolver
// the fn author filters the data in authors to return the author of a specific post, according to the postID
const rootResolver = {
    Query : {
        posts(){
            return posts;
        },
        author(){
            return authors;
        }
    },
    
    Post : {
        author(parent){
            return authors.filter(author => author.postID === parent.id)
        }
    }
    
}

// initialize apollo server
const server = new ApolloServer({
    typeDefs: schema,
    resolvers: rootResolver
});

server.listen({port:4000}).then(({url}) => console.log(`Server ready on ${url}`));

//directly test the API server from localhost