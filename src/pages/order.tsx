import { useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { graphql, useFragment } from "../gql";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderStatus,
  OrderUpdatesSubscription,
  UserRole,
} from "../gql/graphql";
import { useMe } from "../hooks/useMe";

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

const EDIT_ORDER = graphql(`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`);

type TParams = {
  id: string;
};

export const Order = () => {
  const params = useParams() as TParams;
  const { data: userData } = useMe();
  const [editOrderMutation] = useMutation<EditOrderMutation, EditOrderMutationVariables>(EDIT_ORDER);
  const { data, subscribeToMore } = useQuery<GetOrderQuery, GetOrderQueryVariables>(GET_ORDER, {
    variables: {
      input: {
        id: +params.id,
      },
    },
  });
  const order = useFragment(FULL_ORDER_FRAGMENT, data?.getOrder.order);

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          { subscriptionData: { data } }: { subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status: newStatus,
        },
      },
    });
  };

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
          {userData?.me.role === "Client" && (
            <span className="text-center mt-5 mb-3 text-2xl text-lime-600">Status: {order?.status}</span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {order?.status === OrderStatus.Pending && (
                <button onClick={() => onButtonClick(OrderStatus.Cooking)} className="btn">
                  Accept Order
                </button>
              )}
              {order?.status === OrderStatus.Cooking && (
                <button onClick={() => onButtonClick(OrderStatus.Cooked)} className="btn">
                  Order Cooked
                </button>
              )}
              {order?.status !== OrderStatus.Cooking && order?.status !== OrderStatus.Pending && (
                <span className="text-center mt-5 mb-3 text-2xl text-lime-600">Status : {order?.status}</span>
              )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {order?.status === OrderStatus.Cooked && (
                <button onClick={() => onButtonClick(OrderStatus.PickedUp)} className="btn">
                  Picked Up
                </button>
              )}
              {order?.status === OrderStatus.PickedUp && (
                <button onClick={() => onButtonClick(OrderStatus.Delivered)} className="btn">
                  Order Delivered
                </button>
              )}
            </>
          )}
          {order?.status === OrderStatus.Delivered && (
            <span className="text-center mt-5 mb-3 text-2xl text-lime-600">Thank you for using Nuber Eats</span>
          )}
        </div>
      </div>
    </div>
  );
};
