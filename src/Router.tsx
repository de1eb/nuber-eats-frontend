import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import { FormError } from "./components/form-error";
import { NotFound } from "./pages/404";
import { CreateAccount } from "./pages/create-account";
import { LoggedIn } from "./pages/logged-in";
import { Login } from "./pages/login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "login",
        element: <Login />,
        children: [],
        errorElement: <FormError errorMessage="Cannot load login page" />,
      },
      {
        path: "create-account",
        element: <CreateAccount />,
        children: [],
        errorElement: <FormError errorMessage="Cannot create account" />,
      },
      {
        element: <NotFound />,
      },
      {
        element: <LoggedIn />,
      },
    ],
    errorElement: <FormError errorMessage="Cannot load main page" />,
  },
]);
