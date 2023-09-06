import { ApolloClient, InMemoryCache, createHttpLink, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const authTokenVar = makeVar(token);
// export const isLoggedInVar = makeVar(false);

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql"
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": localStorage.getItem(LOCALSTORAGE_TOKEN) || ""
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
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