import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import { FormError } from "./components/form-error";
import { NotFound } from "./pages/404";
import { Category } from "./pages/client/category";
import { Restaurant } from "./pages/client/restaurant";
import { Restaurants } from "./pages/client/restaurants";
import { Search } from "./pages/client/search";
import { CreateAccount } from "./pages/create-account";
import { LoggedIn } from "./pages/logged-in";
import { Login } from "./pages/login";
import { Order } from "./pages/order";
import { AddDish } from "./pages/owner/add-dish";
import { AddRestaurant } from "./pages/owner/add-restaurants";
import { MyRestaurant } from "./pages/owner/my-restaurant";
import { MyRestaurants } from "./pages/owner/my-restaurants";
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
        path: "home",
        Component: LoggedIn,
        children: [
          {
            path: "confirm",
            Component: ConfirmEmail,
          },
          {
            path: "restaurants",
            Component: Restaurants,
          },
          {
            path: "restaurants/:id",
            Component: Restaurant,
          },
          {
            path: "edit-profile",
            Component: EditProfile,
          },
          {
            path: "search",
            Component: Search,
          },
          {
            path: "category/:slug",
            Component: Category,
          },
          {
            path: "myrestaurants",
            Component: MyRestaurants,
          },
          {
            path: "myrestaurants/:id",
            Component: MyRestaurant,
          },
          {
            path: "myrestaurants/:restaurantId/add-dish",
            Component: AddDish,
          },
          {
            path: "add-restaurant",
            Component: AddRestaurant,
          },
          {
            path: "orders/:id",
            Component: Order,
          },
        ],
      },
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
    errorElement: <FormError errorMessage="Cannot load main page" />,
  },
]);
