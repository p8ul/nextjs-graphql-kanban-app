// pages/api/graphql.ts
import { ApolloServer } from "apollo-server-micro";
import { typeDefs, resolvers } from "../schema";

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
  api: {
    bodyParser: false,
  },
};

const startServer = apolloServer.start();

export default async function handler(req, res) {
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}
