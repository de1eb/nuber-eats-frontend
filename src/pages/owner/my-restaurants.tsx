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
interface IParams {
  id: string;
}

export const MyRestaurants = () => {
  const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link className="text-lime-600 hover:underline" to="../add-restaurant">
              Create one &rarr;
            </Link>
          </>
        ) : (
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants.restaurants.map((restaurant, index) => {
              return <Restaurant key={index} restaurant={restaurant} isOwner={true} />;
            })}
            <Link className="text-lime-600 hover:underline" to="../add-restaurant">
              Create one &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
