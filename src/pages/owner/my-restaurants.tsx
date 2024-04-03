import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { graphql } from "../../gql";
import { MyRestaurantsQuery } from "../../gql/graphql";

export const MY_RESTAURANTS_QUERY = graphql(`
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

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="text-4xl font-medium mb-5 px-5">My Restaurants</h2>
        <Link className=" text-white bg-lime-700 mt-5 mx-auto py-2 px-4" to="../add-restaurant">
          Create Restaurant
        </Link>
        {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
          </>
        ) : (
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants.restaurants.map((restaurant, index) => {
              return <Restaurant key={index} restaurant={restaurant} isOwner={true} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
