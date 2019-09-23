/*@flow*/
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';

const DEV = process.env.__DEV__;
const DOMAIN = DEV ? 'citiesense' : 'www.citiesense';
const TLD = DEV ? 'dev' : 'com';
const GRAPHQL_URI = `https://${DOMAIN}.${TLD}/graphql`;

const httpLink = new HttpLink({ uri: GRAPHQL_URI });

const middlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    credentials: 'omit',
    mode: 'no-cors',
  });
  return forward(operation);
});

const client = new ApolloClient<*>({
  link: concat(middlewareLink, httpLink),
  cache: new InMemoryCache(),
});

export default client;
