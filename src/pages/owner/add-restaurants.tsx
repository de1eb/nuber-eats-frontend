import { useApolloClient, useMutation } from "@apollo/client";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { graphql } from "../../gql";
import { CreateRestaurantMutation, CreateRestaurantMutationVariables } from "../../gql/graphql";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT_MUTATION = graphql(`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`);

// 최적화를 위해 refetch해서 레스토랑 목록을 받아오지 않고 캐시에 방금 추가한 레스토랑
// 정보를 추가하려고 함. 그런데 graphql-codegen의 fragment masking된 타입을 readQuery하고
// writeQuery할 때 그대로 적용되기 용이한지 의문. 콘솔상에 많은 에러가 뜨는데 fragmentRef까지
// 흉내내서 writeQuery 한 경우 표시가 되기는 하나 콘솔상 에러가 사라지는 것은 아님
// fragment에 해당하는 필드들이 없다고 나오나 graphql-codegen의 모종의 프로세스로 인해 보여지긴하는 것으로 추정

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const onCompleted = (data: CreateRestaurantMutation) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);

      const queryResult = client.readQuery({
        query: MY_RESTAURANTS_QUERY,
      });
      console.log("queryResult: ", queryResult);
      if (queryResult) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...queryResult.myRestaurants,
              restaurants: [
                {
                  " $fragmentRefs": {
                    RestaurantPartsFragment: {
                      address,
                      category: {
                        name: categoryName,
                        __typename: "Category",
                      },
                      coverImg: imageUrl,
                      id: restaurantId,
                      isPromoted: false,
                      name,
                    },
                  },
                  __typename: "Restaurant",
                },
                ...queryResult.myRestaurants.restaurants,
              ],
            },
          },
        });
      }

      navigate("/home/myrestaurants");
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<CreateRestaurantMutation, CreateRestaurantMutationVariables>(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    // refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });
  const {
    register,
    getValues,
    formState: { isValid },
    handleSubmit,
  } = useForm<IFormProps>({
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
        <input className="input" type="text" placeholder="Name" {...register("name", { required: "Name is required" })} />
        <input className="input" type="text" placeholder="Address" {...register("address", { required: "Address is required" })} />
        <input className="input" type="text" placeholder="Category Name" {...register("categoryName", { required: "Category Name is required" })} />
        <div>
          <input type="file" accept="image/*" {...register("file", { required: true })} />
        </div>
        <Button loading={uploading} canClick={isValid} actionText="Create Restaurant" />
        {data?.createRestaurant.error && <FormError errorMessage={data.createRestaurant.error} />}
      </form>
    </div>
  );
};
