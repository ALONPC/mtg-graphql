const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const api = "https://api.magicthegathering.io/v1";

const typeDefs = gql`
  type Card {
    multiverseid: ID
    name: String!
    cmc: Int
    type: String
    set: String
    imageUrl: String
  }

  type Query {
    cards: [Card]
    getCard(multiverseid: ID!): Card
  }
`;

const resolvers = {
  Query: {
    cards: async () => {
      return await axios
        .get(`${api}/cards`)
        .then(({ data: { cards } }) => cards)
        .catch((err) => console.log(`error ocurred ${err}`));
    },
    getCard: async (_, { multiverseid }) => {
      return await axios
        .get(`${api}/cards/${multiverseid}`)
        .then(({ data: { card } }) => {
          console.log(`Card "${card.name}" found!`);
          return card;
        })
        .catch((err) => {
          console.log(`error ocurred ${err}`);
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
