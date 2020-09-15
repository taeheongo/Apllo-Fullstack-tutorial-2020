import React from "react";
import {
  gql,
  ApolloClient,
  useApolloClient,
  useMutation,
} from "@apollo/client";

import { LoginForm, Loading } from "../components";

export const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

export default function Login() {
  // Let's call useApolloClient to get the currently configured client instance.
  const client = useApolloClient();

  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    // Next, we want to pass an onCompleted callback to useMutation
    // that will be called once the mutation is complete with its return value.
    onCompleted({ login }) {
      localStorage.setItem("token", login);
      client.cache.modify({
        fields: {
          isLoggedIn() {
            return true;
          },
        },
      });
    },
  });
  if (loading) return <Loading />;
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}
