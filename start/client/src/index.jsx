import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
} from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import Pages from "./pages";
import Login from "./pages/login";
import injectStyles from "./styles";
import { resolvers, typeDefs } from "./resolvers";

const cache = new InMemoryCache();

// Specifying the headers option on HttpLink allows us to read the token from localStorage
// and attach it to the request's headers each time a GraphQL operation is made.
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  headers: {
    authorization: localStorage.getItem("token") || "",
  },
  cache,
  typeDefs,
  resolvers,
});

// ...ApolloClient instantiated here...

client
  .query({
    query: gql`
      query TestQuery {
        launch(id: 56) {
          id
          mission {
            name
          }
        }
      }
    `,
  })
  .then((result) => console.log(result));

console.log("cache: ", cache);
console.log("client", client);

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
    cartItems @client
  }
`;

cache.writeQuery({
  query: IS_LOGGED_IN,
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
    cartItems: []
  },
});


// Since cache reads are synchronous, we don't have to account for any loading state.

function IsLoggedIn() {
  const { data } = useQuery(IS_LOGGED_IN);
  return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>,
  document.getElementById("root")
);
