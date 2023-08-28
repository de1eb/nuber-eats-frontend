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
    Component: Root,
    path: "/",
    children: [
      {
        Component: NotFound,
      },
      {
        path: "confirm",
        Component: ConfirmEmail,
      },
      {
        path: "loggedIn",
        Component: LoggedIn,
        children: [
          {
            path: "restaurants",
            Component: Restaurants,
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
            path: "login",
            Component: Login,
            errorElement: <FormError errorMessage="Cannot load login page" />,
          },
          {
            path: "create-account",
            Component: CreateAccount,
            errorElement: <FormError errorMessage="Cannot create account" />,
          },
        ],
      },
    ],
    errorElement: <FormError errorMessage="Cannot load main page" />,
  },
]);
