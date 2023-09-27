import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { CategoryQuery, CategoryQueryVariables } from "../../gql/graphql";

const CATEGORY_QUERY = graphql(`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
`);

export const Category = () => {
  const params = useParams();
  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: params.slug + "",
      },
    },
  });
  return <h1>Category</h1>;
};
