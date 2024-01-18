import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { graphql, useFragment } from "../../gql";
import { CreateOrderItemInput, RestaurantQuery, RestaurantQueryVariables } from "../../gql/graphql";

const RESTAURANT_QUERY = graphql(`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
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

const CREATE_ORDER_MUTATION = graphql(`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
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
  const restaurant = useFragment(RESTAURANT_FRAGMENT, data?.restaurant.restaurant);
  const menu = useFragment(DISH_FRAGMENT, data?.restaurant.restaurant?.menu);

  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const addItemToOrder = (dishId: number) => {
    setOrderItems((current) => [{ dishId }]);
  };
  return (
    <div>
      <Helmet>
        <title>{restaurant?.name || ""} | Nuber Eats</title>
      </Helmet>
      <div className="bg-gray-800 bg-cover bg-center py-48" style={{ backgroundImage: `url(${restaurant?.coverImg})` }}>
        <div className="bg-white w-3/12 py-8 pl-4 md:pl-48">
          <h4 className="text-4xl mb-3">{restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">{restaurant?.category?.name}</h5>
          <h6 className="text-sm font-light">{restaurant?.address}</h6>
        </div>
      </div>

      <div className="container pb-32 flex flex-col items-end mt-20">
        <button onClick={triggerStartOrder} className="btn px-10">
          Start Order
        </button>
        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {menu?.map((dish, index) => (
            <Dish
              id={dish.id}
              orderStarted={orderStarted}
              key={index}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
