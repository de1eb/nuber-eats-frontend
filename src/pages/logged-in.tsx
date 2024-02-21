import { Navigate, Outlet, useLocation } from "react-router-dom";
import { client } from "../apollo";
import { FormError } from "../components/form-error";
import { Header } from "../components/header";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { useMe } from "../hooks/useMe";

export const LoggedIn = () => {
  const { data, loading, error } = useMe();
  const location = useLocation();
  if (error) {
    if (error.message === "jwt expired") {
      localStorage.removeItem(LOCALSTORAGE_TOKEN);
      client.clearStore();
      return <Navigate to="/login" />;
    }
    return <FormError errorMessage="Cannot load page" />;
  }

  if (!data || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <Outlet />
      {location.pathname === "/home" && data.me.role === "Client" && <Navigate to="restaurants" />}
      {location.pathname === "/home" && data.me.role === "Owner" && <Navigate to="myrestaurants" />}
    </div>
  );
};
