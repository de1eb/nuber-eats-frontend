import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { graphql } from "../../__generated__";
import { SearchRestaurantQuery, SearchRestaurantQueryVariables } from "../../__generated__/graphql";

const SEARCH_RESTAURANT = graphql(`
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
`);
// const SEARCH_RESTAURANT = gql`
//   query searchRestaurant($input: SearchRestaurantInput!) {
//     searchRestaurant(input: $input) {
//       ok
//       error
//       totalPages
//       totalResults
//       restaurants {
//         ...RestaurantParts
//       }
//     }
//   }
// `;

export const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [callQuery, { loading, data, called }] = useLazyQuery<SearchRestaurantQuery, SearchRestaurantQueryVariables>(SEARCH_RESTAURANT);
  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return navigate("/", { replace: true });
    }
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [navigate, location]);
  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <h1>Search page</h1>
    </div>
  );
};
