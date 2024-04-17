import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
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

interface IFormProps {
  searchTerm: string;
}

type TCategoryParams = {
  slug: string;
};

export const Category = () => {
  const [page, setPage] = useState(1);
  const params = useParams() as TCategoryParams;
  console.log("params: ", params);
  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: params.slug + "",
      },
    },
  });
  console.log("data: ", data);
  // const restaurants = useFragment(RESTAURANT_FRAGMENT, data?.category.restaurants);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const navigate = useNavigate();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    navigate({
      pathname: "/home/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form name="search" onSubmit={handleSubmit(onSearchSubmit)} className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.category.restaurants?.map((restaurant, index) => {
              return <Restaurant key={index} restaurant={restaurant} isOwner={false} />;
            })}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button onClick={onPrevPageClick} className="focus:outline-none font-medium text-2xl">
                &larr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
          <span>
            Page {page} of {data?.category.totalPages}
          </span>
          {page !== data?.category.totalPages ? (
            <button onClick={onNextPageClick} className="focus:outline-none font-medium text-2xl">
              &rarr;
            </button>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
};
