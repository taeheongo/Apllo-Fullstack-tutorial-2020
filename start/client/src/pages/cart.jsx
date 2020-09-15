import React, { Fragment } from "react";
import { gql, useQuery } from "@apollo/client";

import { Header, Loading } from "../components";
import { CartItem, BookTrips } from "../containers";

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

const Cart = () => {
  const { data, loading, error } = useQuery(GET_CART_ITEMS);

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  console.log("cartItems: ", data);

  return (
    <Fragment>
      <Header>My Cart</Header>
      {!data || (!!data && data.cartItems.length === 0) ? (
        <p data-testid="empty-message">No items in your cart</p>
      ) : (
          <Fragment>
            {!!data &&
              data.cartItems.map((launchId) => (
                <CartItem key={launchId} launchId={launchId} />
              ))}

            <BookTrips cartItems={!!data ? data.cartItems : []} />
          </Fragment>
        )}
    </Fragment>
  );
};

export default Cart;
