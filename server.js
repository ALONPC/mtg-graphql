const { ApolloServer, gql } = require("apollo-server")
const axios = require("axios");
const api = "https://api.magicthegathering.io/v1";

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
    }
`;

const resolvers = {
    Query: {
        cards: () => {
            return new Promise((resolve, reject) => {
                axios.get(`${api}/cards`).then(res => {
                    resolve(res.data.cards
                    )
                }).catch(err => { err })

            })
        },
        getCard: (root, args) => {
            return new Promise((resolve, reject) => {
                const { multiverseid } = args
                axios.get(`${api}/cards/${multiverseid}`).then(res => {
                    console.log('TCL: res.data.card.name', res.data.card.name);
                    resolve(res.data.card)
                }).catch(err => {
                    throw new Error(err)
                })
            })
        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: true
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
})