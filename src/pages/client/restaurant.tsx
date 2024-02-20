import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { graphql, useFragment } from "../../gql";
import { CreateOrderItemInput, CreateOrderMutation, CreateOrderMutationVariables, RestaurantQuery, RestaurantQueryVariables } from "../../gql/graphql";

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
      orderId
    }
  }
`);

type TRestaurantParams = {
  id: string;
};

export const Restaurant = () => {
  const params = useParams() as TRestaurantParams;
  const { data } = useQuery<RestaurantQuery, RestaurantQueryVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id,
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

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) => current.filter((dish) => dish.dishId !== dishId));
  };

  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(oldItem.options?.find((aOption) => aOption.name === optionName));
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [{ dishId, options: [{ name: optionName }, ...oldItem.options!] }, ...current]);
      }
    }
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter((option) => option.name !== optionName),
        },
        ...current,
      ]);
      return;
    }
  };

  const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
    return item.options?.find((option) => option.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const navigate = useNavigate();
  const onCompleted = (data: CreateOrderMutation) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (data.createOrder.ok) {
      navigate(`/orders/${orderId}`);
    }
  };

  const [createOrderMutation, { loading: placeingOrder }] = useMutation<CreateOrderMutation, CreateOrderMutationVariables>(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  const triggerConfirmOrder = () => {
    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }
    const ok = window.confirm("You are about to place an order");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
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

      <div className="container pb-32 flex flex-col items-end mt-20 px-3">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            {orderStarted ? "Ordering" : "Start Order"}
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center px-3">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button onClick={triggerCancelOrder} className="btn px-10 bg-black hover:bg-black">
              Cancel Order
            </button>
          </div>
        )}

        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {menu?.map((dish, index) => (
            <Dish
              isSelected={isSelected(dish.id)}
              id={dish.id}
              orderStarted={orderStarted}
              key={index}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  dishId={dish.id}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
