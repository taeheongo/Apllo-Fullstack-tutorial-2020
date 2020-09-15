import React from 'react'; // preserve-line
import { gql, useMutation } from '@apollo/client'; // preserve-line

import Button from '../components/button'; // preserve-line
import { GET_LAUNCH } from './cart-item'; // preserve-line

export const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

const BookTrips = ({ cartItems }) => {
  const [bookTrips, { data }] = useMutation(BOOK_TRIPS, {
    variables: { launchIds: cartItems },
    refetchQueries: cartItems.map(launchId => ({
      query: GET_LAUNCH,
      variables: { launchId },
    })),
    update(cache) {
      cache.modify({
        fields: {
          cartItems: () => []
        }
      });
    }
  }
  );

  return data && data.bookTrips && !data.bookTrips.success
    ? <p data-testid="message">{data.bookTrips.message}</p>
    : (
      <Button
        onClick={() => bookTrips()}
        data-testid="book-button">
        Book All
      </Button>
    );
}

export default BookTrips;