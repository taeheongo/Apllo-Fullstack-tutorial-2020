import React, { Fragment } from "react";
import { gql, useQuery } from "@apollo/client";

import { Loading, Header, LaunchTile } from "../components";
import { LAUNCH_TILE_DATA } from "./launches";

export const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const Profile = () => {
  // By default, Apollo Client's fetch policy is cache-first,
  // which means it checks the cache to see if the result is there
  // before making a network request.
  // Since we want this list to always reflect the newest data from our graph API,
  // we set the fetchPolicy for this query to network-only
  const { data, loading, error } = useQuery(
    GET_MY_TRIPS,

    { fetchPolicy: "network-only" }
  );
  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (data === undefined) return <p>ERROR</p>;

  console.log("me:", data);

  return (
    <Fragment>
      <Header>My Trips</Header>
      {data.me && data.me.trips.length ? (
        data.me.trips.map((launch) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))
      ) : (
        <p>You haven't booked any trips</p>
      )}
    </Fragment>
  );
};

export default Profile;
