import { gql, useQuery } from "@apollo/client";
import { MeQuery } from "../gql/graphql";

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};
