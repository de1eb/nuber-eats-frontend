import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryTheme, VictoryZoomContainer } from "victory";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
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
        orders {
          ...OrderParts
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
  const restaurant = useFragment(RESTAURANT_FRAGMENT, data?.myRestaurant.restaurant);
  const menu = useFragment(DISH_FRAGMENT, data?.myRestaurant.restaurant?.menu);
  const order = useFragment(ORDERS_FRAGMENT, data?.myRestaurant.restaurant?.orders);
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
      <div className="container mt-10 px-3">
        <h2 className="text-4xl font-medium mb-10">{restaurant?.name || "Loading..."}</h2>
        <Link to={`/home/myrestaurants/${id}/add-dish`} className=" mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish &rarr;
        </Link>
        <Link to={``} className=" text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu?.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {menu?.map((dish, index) => (
                <Dish key={index} name={dish.name} description={dish.description} price={dish.price} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="mt-10">
            <VictoryChart height={500} theme={VictoryTheme.material} width={window.innerWidth} domainPadding={50} containerComponent={<VictoryZoomContainer />}>
              <VictoryLine
                labels={({ datum }: { datum: any }) => `$${datum.y}`}
                labelComponent={<VictoryLabel style={{ fontSize: 18 }} renderInPortal dy={-20} />}
                data={order?.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 12,
                    angle: 45,
                  } as any,
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
