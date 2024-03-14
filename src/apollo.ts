import { ApolloClient, InMemoryCache, createHttpLink, makeVar, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const authTokenVar = makeVar(token);
// export const isLoggedInVar = makeVar(false);

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === "production" ? "https://alb-549571255.ap-northeast-2.elb.amazonaws.com/graphql" : "http://localhost:4000/graphql"
});

const wsLink = new GraphQLWsLink(createClient({
  url: process.env.NODE_ENV === "production" ? "wss://alb-549571255.ap-northeast-2.elb.amazonaws.com/graphql" : "ws://localhost:4000/graphql",
  connectionParams: {
    "x-jwt": localStorage.getItem(LOCALSTORAGE_TOKEN) || ""
  }
}));

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": localStorage.getItem(LOCALSTORAGE_TOKEN) || ""
    }
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // isLoggedIn: {
          //   read() {
          //     return isLoggedInVar();
          //   }
          // },
          token: {
            read() {
              return localStorage.getItem(LOCALSTORAGE_TOKEN)
            }
          }
        }
      }
    }
  }),
});
