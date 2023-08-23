import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import { FormError } from "./components/form-error";
import { NotFound } from "./pages/404";
import { Restaurants } from "./pages/client/restaurants";
import { CreateAccount } from "./pages/create-account";
import { LoggedIn } from "./pages/logged-in";
import { LoggedOut } from "./pages/logged-out";
import { Login } from "./pages/login";
import { ConfirmEmail } from "./pages/user/confirm-email";
import { EditProfile } from "./pages/user/edit-profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        Component: NotFound,
      },
      {
        Component: LoggedIn,
        children: [
          {
            path: "restaurants",
            Component: Restaurants,
            children: [],
          },
          {
            path: "confirm",
            Component: ConfirmEmail,
            children: [
              {
                path: "code:code",
              },
            ],
          },
          {
            path: "edit-profile",
            Component: EditProfile,
          },
        ],
      },
      {
        Component: LoggedOut,
        children: [
          {
            path: "create-account",
            Component: CreateAccount,
            children: [],
            errorElement: <FormError errorMessage="Cannot create account" />,
          },
          {
            path: "login",
            Component: Login,
            children: [],
            errorElement: <FormError errorMessage="Cannot load login page" />,
          },
        ],
      },
    ],
    errorElement: <FormError errorMessage="Cannot load main page" />,
  },
]);
