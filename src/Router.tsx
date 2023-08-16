import { createBrowserRouter } from "react-router-dom";
import { FormError } from "./components/form-error";
import { CreateAccount } from "./pages/create-account";
import { Login } from "./pages/login";

const router = createBrowserRouter([
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
]);

export default router;
