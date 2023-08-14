import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { LoginMutation, LoginMutationVariables } from "../__generated__/graphql";
import { FormError } from "../components/form-error";

interface IloginForm {
  email: string;
  password: string;
  resultError?: string;
}

const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<IloginForm>();
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const [loginMutation, { data: LoginMutationResult }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION, { onCompleted });
  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
          <input {...register("email", { required: "Email is required." })} type="email" placeholder="Email" className="input" />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          <input
            {...register("password", { required: "Password is required." })}
            placeholder="Password"
            className=" bg-gray-100 shadow-inner focus:outline-none border-2 focus:border-opacity-60 focus:border-green-600  py-3 px-5 rounded-lg"
          />
          {errors.password?.type === "minLength" && <FormError errorMessage="Password must be more than 10 chars." />}
          <button className="=mt-3 btn">Log In</button>
          {LoginMutationResult?.login.error && <FormError errorMessage={LoginMutationResult.login.error} />}
        </form>
      </div>
    </div>
  );
};
