import { gql, useApolloClient, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { redirect } from "react-router-dom";
import { VerifyEmailMutation, VerifyEmailMutationVariables } from "../../__generated__/graphql";
import { useMe } from "../../hooks/useMe";
import { useQueryParams } from "../../hooks/useQueryParams";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: VerifyEmailMutation) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      // navigate("/", { replace: true });
      redirect("/");
    }
  };
  const [verifyEmail] = useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VERIFY_EMAIL_MUTATION, { onCompleted });

  const code = useQueryParams("code");
  useEffect(() => {
    if (code) {
      verifyEmail({
        variables: {
          input: {
            code,
          },
        },
      });
    }
  }, [verifyEmail, code]);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">Please wait, don't close this page...</h4>
    </div>
  );
};
