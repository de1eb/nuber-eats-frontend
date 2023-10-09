import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { RestaurantQuery, RestaurantQueryVariables } from "../../gql/graphql";

const RESTAURANT_QUERY = graphql(`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
`);

type TRestaurantParams = {
  id: string;
};

export const Restaurant = () => {
  const { id } = useParams() as TRestaurantParams;
  const { loading, data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });
  console.log(data);
  return <h1>Restaurant</h1>;
};
