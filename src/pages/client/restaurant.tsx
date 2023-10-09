import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { FragmentType, graphql, useFragment } from "../../gql";
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

type RestaurantProps = {
  restaurant: FragmentType<typeof RESTAURANT_FRAGMENT>;
};
export const Restaurant = (props: RestaurantProps) => {
  const { id } = useParams() as TRestaurantParams;
  const { loading, data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });
  const { coverImg } = useFragment(RESTAURANT_FRAGMENT, props.restaurant);
  return (
    <div>
      <div className="bg-red-500 py-48" style={{ backgroundImage: `url(${coverImg})` }}></div>
    </div>
  );
};
