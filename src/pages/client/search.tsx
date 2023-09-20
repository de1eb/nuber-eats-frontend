import { gql } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";

const SEARCH_RESTAURANT = gql`
  ${RESTAURANT_FRAGMENT}
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const [callQuery, { loading, data, called }] = useLazyQuery<searchResta
};
