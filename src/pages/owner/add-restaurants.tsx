import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { graphql } from "../../gql";
import { CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../gql/graphql";

const CREATE_RESTAURANT_MUTATION = graphql(`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
    }
  }
`);

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const [createRestaurantMutation, { loading, data }] = useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(CREATE_RESTAURANT_MUTATION);
  const { register, getValues, formState, setError, handleSubmit } = useForm<IFormProps>({ mode: "onChange" });
  const onSubmit = () => {
    console.log(getValues());
  };
  return <div></div>;
};
