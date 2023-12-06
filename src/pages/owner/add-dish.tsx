import { useMutation } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import { graphql } from "../../gql";
import { CreateDishMutation, CreateDishMutationVariables } from "../../gql/graphql";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = graphql(`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`);

type TParams = {
  restaurantId: string;
};

interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams() as TParams;
  const [createDishMutation, { loading }] = useMutation<CreateDishMutation, CreateDishMutationVariables>(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });

  const { register, handleSubmit, formState, getValues, setValue } = useForm<IForm>({
    mode: "onChange",
  });

  const navigate = useNavigate();
  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionObjects = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
        },
      },
    });
    navigate(-1);
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-1">
        <input className="input" type="text" placeholder="Name" {...register("name", { required: "Name is required" })} />
        <input className="input" type="number" min={0} placeholder="Price" {...register("price", { required: "Price is required" })} />
        <input className="input" type="text" placeholder="Description" {...register("description", { required: "Description is required" })} />
        <div className="my-10">
          <h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
          <span onClick={onAddOptionClick} className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-">
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  className="py-2 px-4 forcus-outline-none mr-3 focus:border-gray-600 border-2"
                  type="text"
                  placeholder="Option Name"
                  {...register(`${id}-optionName`)}
                />
                <input
                  className="py-2 px-4 forcus-outline-none mr-3 focus:border-gray-600 border-2"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                  {...register(`${id}-optionExtra`)}
                />
                <span className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5" onClick={() => onDeleteClick(id)}>
                  Delete Option
                </span>
              </div>
            ))}
        </div>

        <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
      </form>
      <form onClick={() => navigate(`/home/myrestaurants/${restaurantId}`)} className="grid max-w-screen-sm gap-3 mt-1 w-full mb-5">
        <Button loading={false} canClick={true} actionText="Cancel" />
      </form>
    </div>
  );
};
