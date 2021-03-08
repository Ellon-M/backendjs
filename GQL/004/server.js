// making post requests with GraphQL


//using apollo server
const {ApolloServer, gql} = require('apollo-server');

// use the type mutation to create post requests

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

type Mutation{
    createPost(id: Int, title: String) : Post
}
`;

const rootResolver = {
    Query : {
        posts(){
            return posts;
        },
        author(){
            return authors;
        }
    },
   

    Mutation: {
        //parent, args, context, info
        createPost: (_, args) => {
            return { id: args.id, title: args.title}
        }
    }
}

//define the server
const server = new ApolloServer({
    typeDefs: schema,
    resolvers: rootResolver
});

server.listen({port:3000}).then(({url}) => console.log(`Server ready on ${url}`));