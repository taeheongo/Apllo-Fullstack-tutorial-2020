import { gql } from "@apollo/client";
import { GET_CART_ITEMS } from "./pages/cart";

// To build a client schema, we extend the types of our server schema
//  and wrap it with the gql function
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {
  Launch: {
    isInCart: (launch, _, { cache }) => {
      const queryResult = cache.readQuery({
        query: GET_CART_ITEMS,
      });

      if (queryResult) {
        return queryResult.cartItems.includes(launch.id);
      }

      return false;
    },
  },
  // Apollo cache is already added to the context for you.
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const queryResult = cache.readQuery({
        query: GET_CART_ITEMS
      });

      if (queryResult) {
        const { cartItems } = queryResult;
        const data = {
          cartItems: cartItems.includes(id)
            ? cartItems.filter(i => i !== id)
            : [...cartItems, id]
        };

        cache.writeQuery({ query: GET_CART_ITEMS, data });
        return data.cartItems;
      }
      return [];
    }
  }
};

export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;
