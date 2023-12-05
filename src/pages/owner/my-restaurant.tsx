import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { graphql, useFragment } from "../../gql";
import { MyRestaurantQuery, MyRestaurantQueryVariables } from "../../gql/graphql";

export const MY_RESTAURANT_QUERY = graphql(`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
`);
type TParams = {
  id: string;
};

export const MyRestaurant = () => {
  const { id } = useParams() as TParams;
  const { data } = useQuery<MyRestaurantQuery, MyRestaurantQueryVariables>(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id,
      },
    },
  });
  console.log(data);
  const restaurant = useFragment(RESTAURANT_FRAGMENT, data?.myRestaurant.restaurant);
  return (
    <div>
      <Helmet>
        <title>{restaurant?.name || "Loading..."} | Nuber Eats</title>
      </Helmet>
      <div
        className="  bg-gray-700  py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">{restaurant?.name || "Loading..."}</h2>
        <Link to={`/restaurants/${id}/add-dish`} className=" mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish &rarr;
        </Link>
        <Link to={``} className=" text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">{data?.myRestaurant.restaurant?.menu.length === 0 ? <h4 className="text-xl mb-5">Please upload a dish!</h4> : null}</div>
      </div>
    </div>
  );
};
