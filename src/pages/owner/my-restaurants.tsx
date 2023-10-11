import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { graphql } from "../../gql";
import { MyRestaurantsQuery } from "../../gql/graphql";

const MY_RESTAURANTS_QUERY = graphql(`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
`);

export const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);
  useEffect(() => {
    console.log(data);
  });
  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 && (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link className="text-lime-600 hover:underline" to="../add-restaurant">
              Create one &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
