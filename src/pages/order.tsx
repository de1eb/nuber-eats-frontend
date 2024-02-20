import { useQuery, useSubscription } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { graphql, useFragment } from "../gql";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderUpdatesSubscription,
  OrderUpdatesSubscriptionVariables,
} from "../gql/graphql";

const GET_ORDER = graphql(`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
`);

const ORDER_SUBSCRIPTION = graphql(`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
`);

type TParams = {
  id: string;
};

export const Order = () => {
  const params = useParams() as TParams;
  const { data } = useQuery<GetOrderQuery, GetOrderQueryVariables>(GET_ORDER, {
    variables: {
      input: {
        id: +params.id,
      },
    },
  });
  const order = useFragment(FULL_ORDER_FRAGMENT, data?.getOrder.order);
  const { data: subscriptionData } = useSubscription<OrderUpdatesSubscription, OrderUpdatesSubscriptionVariables>(
    ORDER_SUBSCRIPTION,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );
  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | Nuber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">Order #{params.id}</h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">${order?.total}</h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By: <span className="font-medium">{order?.restaurant?.name}</span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To: <span className="font-medium">{order?.customer?.email}</span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver: <span className="font-medium">{order?.driver?.email || "Not yet."}</span>
          </div>
          <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">Status: {order?.status}</span>
        </div>
      </div>
    </div>
  );
};
