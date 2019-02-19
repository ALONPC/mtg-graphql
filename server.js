const { ApolloServer, gql } = require("apollo-server")
const axios = require("axios");
const api = "https://api.magicthegathering.io/v1/cards";

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
} = require("graphql");

// const Card = new GraphQLObjectType({
//     name: "Card",
//     fields: () => ({
//         name: { type: GraphQLString },
//         multiverseid: { type: GraphQLInt },
//     })
// });

// const RootQuery = new GraphQLObjectType({
//     name: "RootQueryType",
//     fields: {
//         launch: {
//             type: Card,
//             args: {
//                 multiverseid: { type: GraphQLInt }
//             },
//             resolve(parent, args) {
//                 return axios
//                     .get(`${api}/${args.multiverseid}`)
//                     .then(res => res.data)
//                     .catch(err =>
//                         console.log(
//                             err
//                         )
//                     );
//             }
//         },
//     }
// });

const typeDefs = gql`
    type Card {
        multiverseid: Int
        name: String!
        cmc: Int
        type: String
        set: String
        imageUrl: String
    }

    type Query {
        cards: [Card]
        getCard(multiverseid: Int!): Card
        # getCard: Card
    }
`;


const resolvers = {
    Query: {
        cards: () => {
            return new Promise((resolve, reject) => {
                axios.get(api).then(res => {
                    resolve(res.data.cards
                    )
                }).catch(err => { err })

            })
        },
        getCard: (root, args) => {
            return new Promise((resolve, reject) => {
                const { multiverseid } = args
                axios.get(`${api}/${multiverseid}`).then(res => {
                    console.log('TCL: res.data.card.name', res.data.card.name);
                    resolve(res.data.card)
                }).catch(err => {
                    console.log('TCL: err', err)
                })
            })

        },
        // getCard: () => {
        //     return new Promise((resolve, reject) => {
        //         axios.get("https://api.magicthegathering.io/v1/cards/386616").then(res => {
        //             // console.log('TCL: res.data.cards[0]', res.data.cards[0])
        //             // return res.data;
        //             console.log('TCL: res.data', res.data.card);
        //             // res.data = res.data.card;
        //             // res.data.card.name;
        //             resolve(res.data.card)
        //         }).catch(err => {
        //             console.log('TCL: err', err)
        //         })
        //     })
        // }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true
    // typeDefs: [Card],
    // resolvers: [RootQuery]
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
})