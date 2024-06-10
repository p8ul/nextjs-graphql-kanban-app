import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create a new ApolloClient instance
const client = new ApolloClient({
  // Set the URI for GraphQL endpoint
  uri: '/api/graphql',
  // Use an in-memory cache for caching GraphQL query results
  cache: new InMemoryCache(),
});

export default client;
