const { ApolloServer, gql } = require("apollo-server");
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
    cards: async (root, args) => {
      return await axios
        .get(`${api}/cards`)
        .then((res) => res.data.cards)
        .catch((err) => console.log(`error ocurred ${err}`));
    },
    getCard: async (root, args) => {
      const { multiverseid } = args;
      return await axios
        .get(`${api}/cards/${multiverseid}`)
        .then((res) => res.data.card)
        .catch((err) => {
          throw new Error(err);
        });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
