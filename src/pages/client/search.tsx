import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { graphql } from "../../gql";
import { SearchRestaurantQuery, SearchRestaurantQueryVariables } from "../../gql/graphql";

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

interface IFormProps {
  searchTerm: string;
}

export const Search = () => {
  const [page, setPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const [callQuery, { loading, data, called }] = useLazyQuery<SearchRestaurantQuery, SearchRestaurantQueryVariables>(SEARCH_RESTAURANT);
  useEffect(() => {
    // eslint-disable-next-line
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
  }, [location.search]);
  console.log(loading, data, called);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
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
        <title>Search | Nuber Eats</title>
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
            {data?.searchRestaurant.restaurants?.map((restaurant, index) => {
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
            Page {page} of {data?.searchRestaurant.totalPages}
          </span>
          {page !== data?.searchRestaurant.totalPages ? (
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
