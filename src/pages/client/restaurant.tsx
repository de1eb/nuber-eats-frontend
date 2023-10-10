import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { graphql, useFragment } from "../../gql";
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
  const { data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +id,
      },
    },
  });
  const fragment = useFragment(RESTAURANT_FRAGMENT, data?.restaurant.restaurant);
  return (
    <div>
      <Helmet>
        <title>{fragment?.name || ""} | Nuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 bg-cover bg-center py-48" style={{ backgroundImage: `url('data:image/jpeg;base64, ${fragment?.coverImg}')` }}>
        <div className="bg-white w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">{fragment?.name}</h4>
          <h5 className="text-sm font-light mb-2">{fragment?.category?.name}</h5>
          <h6 className="text-sm font-light">{fragment?.address}</h6>
        </div>
      </div>
    </div>
  );
};
